// Copyright 2020, University of Colorado Boulder

//TODO temporary view of one item of food
/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import Food from '../model/Food.js';
import SpriteNode from './SpriteNode.js';

class FoodNode extends SpriteNode {

  /**
   * @param {Food} food
   * @param {Object} [options]
   */
  constructor( food, options ) {

    assert && assert( food instanceof Food, 'invalid food' );

    options = merge( {

      // SpriteNode options
      scaleFactor: 0.5 // scale applied in addition to modelViewTransform scale
    }, options );

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
      const originNode = new Circle( 4, { fill: 'red' } );

      // Show the tandem name
      const debugLabelNode = new Text( food.tandem.name, {
        font: new PhetFont( 32 ),
        fill: 'black',
        centerX: toughFoodNode.centerX,
        top: toughFoodNode.bottom + 5
      } );

      options.children.push( originNode );
      options.children.push( debugLabelNode );
    }

    super( food, options );

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

naturalSelection.register( 'FoodNode', FoodNode );
export default FoodNode;