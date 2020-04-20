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
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import SpriteNode from './SpriteNode.js';

// constants
const IMAGE_SCALE = 0.5; // how much the food PNG images are scaled

class FoodNode extends SpriteNode {

  /**
   * @param {Food} food
   * @param {Object} [options]
   */
  constructor( food, options ) {

    assert && assert( food instanceof Food, 'invalid food' );

    options = merge( {}, options );

    const toughFoodNode = new Image( food.toughImage, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    const tenderFoodNode = new Image( food.tenderImage, {
      scale: IMAGE_SCALE,
      centerX: toughFoodNode.centerX,
      bottom: toughFoodNode.bottom
    } );

    assert && assert( !options.children, 'FoodNode sets children' );
    options.children = [ toughFoodNode, tenderFoodNode ];

    if ( NaturalSelectionQueryParameters.showSpriteInfo ) {

      // Red dot at the origin
      const originNode = new Circle( 2, { fill: 'red' } );

      // Show the tandem name
      const debugLabelNode = new Text( food.tandem.name, {
        font: new PhetFont( 12 ),
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