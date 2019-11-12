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
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class ProportionBarNode extends Node {

    /**
     * @param {Color|string} color
     * @param {Property.<number>} nonMutantCountCountProperty
     * @param {Property.<number>} mutantCountProperty
     * @param {Object} [options]
     */
    constructor( color, nonMutantCountCountProperty, mutantCountProperty, options ) {

      options = merge( {
        barWidth: 120,
        barHeight: 30
      }, options );

      const nonMutantRectangle = new Rectangle( 0, 0, options.barWidth, options.barHeight, {
        fill: color
      } );

      const mutantRectangle = new HatchingRectangle( 0, 0, options.barWidth, options.barHeight, {
        fill: color
      } );

      assert && assert( !options.children, 'ProportionBarNode sets children' );
      options.children = [ nonMutantRectangle, mutantRectangle ];

      super( options );

      // @private
      this.nonMutantRectangle = nonMutantRectangle;
      this.mutantRectangle = mutantRectangle;
      this.barWidth = options.barWidth;

      Property.multilink( [ nonMutantCountCountProperty, mutantCountProperty ],
        ( nonMutantCountCount, mutantCount ) => this.update( nonMutantCountCount, mutantCount )
      );
    }

    /**
     * Updates this node.
     * @param {number} nonMutantCountCount
     * @param {number} mutantCount
     * @private
     */
    update( nonMutantCountCount, mutantCount ) {

      const total = nonMutantCountCount + mutantCount;

      //TODO round to integer values
      const nonMutantPercentage = nonMutantCountCount / total;
      const mutantPercentage = mutantCount / total;

      this.nonMutantRectangle.visible = ( nonMutantPercentage > 0 );
      this.mutantRectangle.visible = ( mutantPercentage > 0 );

      if ( mutantPercentage > 0 ) {
        this.mutantRectangle.rectWidth = mutantPercentage * this.barWidth;
        this.mutantRectangle.right = this.nonMutantRectangle.right;
      }
    }
  }

  return naturalSelection.register( 'ProportionBarNode', ProportionBarNode );
} );