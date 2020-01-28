// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeModel = require( 'NATURAL_SELECTION/common/model/PedigreeModel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class PedigreeGraphNode extends Node {

    /**
     * @param {PedigreeModel} pedigreeModel
     * @param {Object} [options]
     */
    constructor( pedigreeModel, options ) {

      assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );

      options = merge( {
        graphWidth: 100,
        graphHeight: 100
      }, options );

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
        fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      assert && assert( !options.children, 'PedigreeGraphNode sets children' );
      options.children = [ rectangle ];

      super( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PedigreeGraphNode does not support dispose' );
    }
  }

  return naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );
} );