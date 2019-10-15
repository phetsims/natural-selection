// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeNode displays the pedigree for an individual.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  class PedigreeNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      //TODO placeholder
      const text = new Text( 'Pedigree', {
        font: NaturalSelectionConstants.TITLE_FONT,
        center: rectangle.center
      } );

      assert && assert( !options.children, 'PedigreeNode sets children' );
      options.children = [ rectangle, text ];

      super( options );
    }
  }

  return naturalSelection.register( 'PedigreeNode', PedigreeNode );
} );