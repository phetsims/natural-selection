// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsBarNode is a bar in the Proportions graph, showing the percentage of mutant vs non-mutant genes for
 * a trait in the population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Utils from '../../../../../dot/js/Utils.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Color from '../../../../../scenery/js/util/Color.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import naturalSelection from '../../../naturalSelection.js';
import HatchingRectangle from '../HatchingRectangle.js';

// constants
const PERCENTAGE_FONT = new PhetFont( 12 );

class ProportionsBarNode extends Node {

  /**
   * @param {Color|string} color
   * @param {Property.<number>} nonMutantCountCountProperty
   * @param {Property.<number>} mutantCountProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( color, nonMutantCountCountProperty, mutantCountProperty, valuesVisibleProperty, options ) {

    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );
    assert && assert( nonMutantCountCountProperty instanceof Property, 'invalid nonMutantCountCountProperty' );
    assert && assert( mutantCountProperty instanceof Property, 'invalid mutantCountProperty' );
    assert && assert( valuesVisibleProperty instanceof Property, 'invalid valuesVisibleProperty' );

    options = merge( {
      barWidth: 120,
      barHeight: 30
    }, options );

    // Portions of the bar for non-mutant and mutant counts. Only the mutantRectangle will be resized.
    const nonMutantRectangle = new Rectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );
    const mutantRectangle = new HatchingRectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );

    // Percentages for non-mutant and mutant counts
    const percentageOptions = {
      font: PERCENTAGE_FONT,
      bottom: -4,
      maxWidth: 40 // determined empirically
    };
    const nonMutantPercentageNode = new Text( '', percentageOptions );
    const mutantPercentageNode = new Text( '', percentageOptions );

    assert && assert( !options.children, 'ProportionsBarNode sets children' );
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
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsBarNode does not support dispose' );
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
      this.nonMutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.greaterThanValuePercent, { value: 99 } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.lessThanValuePercent, { value: 1 } );
    }
    else if ( nonMutantPercentage > 0 && nonMutantPercentage < 1 ) {

      // 99% mutant
      this.mutantRectangle.rectWidth = 0.99 * this.barWidth;

      // < 1% non-mutant, > 99% mutant
      this.nonMutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.lessThanValuePercent, { value: 1 } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.greaterThanValuePercent, { value: 99 } );
    }
    else {

      // round both percentages to the nearest integer
      this.mutantRectangle.rectWidth = ( Utils.roundSymmetric( mutantPercentage ) / 100 ) * this.barWidth;

      this.nonMutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.valuePercent, {
        value: Utils.roundSymmetric( nonMutantPercentage )
      } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.valuePercent, {
        value: Utils.roundSymmetric( mutantPercentage )
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

naturalSelection.register( 'ProportionsBarNode', ProportionsBarNode );
export default ProportionsBarNode;