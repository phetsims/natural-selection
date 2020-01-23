// Copyright 2020, University of Colorado Boulder

//TODO temporary view of one item of food
/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Image = require( 'SCENERY/nodes/Image' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const SCALE = 0.5; // scale applied in addition to modelViewTransform scale

  class FoodNode extends Node {

    /**
     * @param {Food} food
     * @param {EnvironmentModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( food, modelViewTransform, options ) {

      options = options || {};

      const toughFoodNode = new Image( food.toughImage, {
        centerX: 0,
        bottom: 0
      } );

      const tenderFoodNode = new Image( food.tenderImage, {
        centerX: toughFoodNode.centerX,
        bottom: toughFoodNode.bottom
      } );

      assert && assert( !options.children, 'FoodNode sets children' );
      options.children = [ toughFoodNode, tenderFoodNode ];

      if ( phet.chipper.queryParameters.dev ) {

        // Red dot at the origin
        const originNode = new Circle( 4, {
          fill: 'red'
        } );

        // Show the label corresponding to the specification in https://github.com/phetsims/natural-selection/issues/17.
        const debugLabelNode = new Text( food.debugLabel, {
          font: new PhetFont( 32 ),
          fill: 'black',
          centerX: toughFoodNode.centerX,
          top: toughFoodNode.bottom + 5
        } );

        options.children.push( originNode );
        options.children.push( debugLabelNode );
      }

      super( options );

      const scale = SCALE * modelViewTransform.getViewScale( food.position.z );
      this.setScaleMagnitude( scale );

      this.translation = modelViewTransform.modelToViewPosition( food.position );

      // Show/hide food
      food.visibleProperty.link( visible => {
        this.visible = visible;
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