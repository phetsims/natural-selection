// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class PedigreeGraphNode extends Node {

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

      assert && assert( !options.children, 'PedigreeGraphNode sets children' );
      options.children = [ rectangle ];

      super( options );
    }
  }

  return naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );
} );