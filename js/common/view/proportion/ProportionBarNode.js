// Copyright 2019, University of Colorado Boulder

/**
 * ProportionBarNode is a bar in the Proportion graph, showing the percentage of mutant vs non-mutant genes for
 * a trait in the population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const HatchingRectangle = require( 'NATURAL_SELECTION/common/view/HatchingRectangle' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // strings
  const greaterThanValuePercentString = require( 'string!NATURAL_SELECTION/greaterThanValuePercent' );
  const lessThanValuePercentString = require( 'string!NATURAL_SELECTION/lessThanValuePercent' );
  const valuePercentString = require( 'string!NATURAL_SELECTION/valuePercent' );

  // constants
  const PERCENTAGE_FONT = new PhetFont( 12 );

  class ProportionBarNode extends Node {

    /**
     * @param {Color|string} color
     * @param {Property.<number>} nonMutantCountCountProperty
     * @param {Property.<number>} mutantCountProperty
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( color, nonMutantCountCountProperty, mutantCountProperty, valuesVisibleProperty, options ) {

      options = merge( {
        barWidth: 120,
        barHeight: 30
      }, options );

      // Portions of the bar for non-mutant and mutant counts. Only the mutantRectangle will be resized.
      const nonMutantRectangle = new Rectangle( 0, 0, options.barWidth, options.barHeight, {
        fill: color
      } );
      const mutantRectangle = new HatchingRectangle( 0, 0, options.barWidth, options.barHeight, {
        fill: color
      } );

      // Percentages for non-mutant and mutant counts
      const percentageOptions = {
        font: PERCENTAGE_FONT,
        bottom: -4,
        maxWidth: 40 // determined empirically
      };
      const nonMutantPercentageNode = new Text( '', percentageOptions );
      const mutantPercentageNode = new Text( '', percentageOptions );

      assert && assert( !options.children, 'ProportionBarNode sets children' );
      options.children = [ nonMutantRectangle, mutantRectangle, nonMutantPercentageNode, mutantPercentageNode ];

      super( options );

      // @private
      this.nonMutantRectangle = nonMutantRectangle;
      this.mutantRectangle = mutantRectangle;
      this.nonMutantPercentageNode = nonMutantPercentageNode;
      this.mutantPercentageNode = mutantPercentageNode;
      this.barWidth = options.barWidth;

      //TODO this will result in bogus intermediate states
      Property.multilink( [ nonMutantCountCountProperty, mutantCountProperty, valuesVisibleProperty ],
        ( nonMutantCountCount, mutantCount, valuesVisible ) =>
          this.update( nonMutantCountCount, mutantCount, valuesVisible )
      );
    }

    /**
     * Updates this node. Note that only mutantRectangle is resized.
     * @param {number} nonMutantCountCount
     * @param {number} mutantCount
     * @param {boolean} valuesVisible
     * @private
     */
    update( nonMutantCountCount, mutantCount, valuesVisible ) {

      const total = nonMutantCountCount + mutantCount;

      const nonMutantPercentage = 100 * nonMutantCountCount / total;
      const mutantPercentage = 100 * mutantCount / total;

      // hide zero-length bar
      this.mutantRectangle.visible = ( mutantPercentage > 0 );

      // hide N% values
      this.nonMutantPercentageNode.visible = ( valuesVisible && nonMutantPercentage > 0 );
      this.mutantPercentageNode.visible = ( valuesVisible && mutantPercentage > 0 );

      // update the mutant portion of the bar and the N% values
      if ( mutantPercentage > 0 && mutantPercentage < 1 ) {

        // 1% mutant
        this.mutantRectangle.rectWidth = 0.01 * this.barWidth;

        // > 99% non-mutant, < 1% mutant
        this.nonMutantPercentageNode.text = StringUtils.fillIn( greaterThanValuePercentString, { value: 99 } );
        this.mutantPercentageNode.text = StringUtils.fillIn( lessThanValuePercentString, { value: 1 } );
      }
      else if ( nonMutantPercentage > 0 && nonMutantPercentage < 1 ) {

        // 99% mutant
        this.mutantRectangle.rectWidth = 0.99 * this.barWidth;

        // < 1% non-mutant, > 99% mutant
        this.nonMutantPercentageNode.text = StringUtils.fillIn( lessThanValuePercentString, { value: 1 } );
        this.mutantPercentageNode.text = StringUtils.fillIn( greaterThanValuePercentString, { value: 99 } );
      }
      else {

        // round both percentages to the nearest integer
        this.mutantRectangle.rectWidth = ( Util.roundSymmetric( mutantPercentage ) / 100 ) * this.barWidth;

        this.nonMutantPercentageNode.text = StringUtils.fillIn( valuePercentString, {
          value: Util.roundSymmetric( nonMutantPercentage )
        } );
        this.mutantPercentageNode.text = StringUtils.fillIn( valuePercentString, {
          value: Util.roundSymmetric( mutantPercentage )
        } );
      }
      this.mutantRectangle.right = this.nonMutantRectangle.right;

      // center N% above its portion of the bar
      if ( nonMutantPercentage > 0 ) {
        this.nonMutantPercentageNode.centerX = ( nonMutantPercentage / 100 ) * ( this.barWidth / 2 );
      }
      if ( mutantPercentage > 0 ) {
        this.mutantPercentageNode.centerX = this.barWidth - ( ( mutantPercentage / 100 ) * ( this.barWidth / 2 ) );
      }

      // horizontally constrain N% to left and right edges of bars
      if ( this.nonMutantPercentageNode.left < this.nonMutantRectangle.left ) {
        this.nonMutantPercentageNode.left = this.nonMutantRectangle.left;
      }
      else if ( this.nonMutantPercentageNode.right > this.nonMutantRectangle.right ) {
        this.nonMutantPercentageNode.right = this.nonMutantRectangle.right;
      }

      if ( this.mutantPercentageNode.left < this.nonMutantRectangle.left ) {
        this.mutantPercentageNode.left = this.nonMutantRectangle.left;
      }
      else if ( this.mutantPercentageNode.right > this.nonMutantRectangle.right ) {
        this.mutantPercentageNode.right = this.nonMutantRectangle.right;
      }
    }
  }

  return naturalSelection.register( 'ProportionBarNode', ProportionBarNode );
} );