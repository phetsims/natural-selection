// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  class PopulationGraphNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: 'black'
      } );

      //TODO placeholder
      const text = new Text( 'Population', {
        font: new PhetFont( 14 ),
        center: rectangle.center
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ rectangle, text ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );