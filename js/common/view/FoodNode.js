// Copyright 2020, University of Colorado Boulder

//TODO temporary view of one item of food
/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class FoodNode extends Node {

    /**
     * @param {Food} food
     * @param {Landscape} landscape
     * @param {Object} [options]
     */
    constructor( food, landscape, options ) {

      options = options || {};

      //TODO need PNG files for food
      const toughFoodNode = new Rectangle( 0, 0, 50, 50, { fill: 'red' } );
      const tenderFoodNode = new Rectangle( 0, 0, 50, 50, { fill: 'green' } );

      assert && assert( !options.children, 'FoodNode sets children' );
      options.children = [ toughFoodNode, tenderFoodNode ];

      super( options );

      const scale = landscape.getViewScale( food.position.z );
      this.setScaleMagnitude( scale );

      const viewPosition = landscape.spriteToScreen( food.position );
      this.centerX = viewPosition.x;
      this.bottom = viewPosition.y;

      // Hide food that doesn't exist
      food.existsProperty.link( exists => {
        this.visible = exists;
      } );

      //TODO use ToggleNode
      // Toggle the look of the food between tender and tough.
      food.isToughProperty.link( isTough => {
        toughFoodNode.visible = isTough;
        tenderFoodNode.visible = !isTough;
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'FoodNode does not support dispose' );
    }
  }

  return naturalSelection.register( 'FoodNode', FoodNode );
} );