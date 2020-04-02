// Copyright 2020, University of Colorado Boulder

/**
 * FoodSupply is the model of the food supply.  It controls the type and quantity of food available to the bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import tenderFoodAImage from '../../../images/tenderFoodA_png.js';
import tenderFoodBImage from '../../../images/tenderFoodB_png.js';
import tenderFoodCImage from '../../../images/tenderFoodC_png.js';
import toughFoodAImage from '../../../images/toughFoodA_png.js';
import toughFoodBImage from '../../../images/toughFoodB_png.js';
import toughFoodCImage from '../../../images/toughFoodC_png.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Food from './Food.js';

class FoodSupply {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.isToughProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isToughProperty' )
    } );

    // @public
    this.isLimitedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isLimitedProperty' )
    } );

    // {Array} Description of food, where each element contains:
    // {HTMLImageElement} toughImage - image used for tough food
    // {HTMLImageElement} tenderImage - image used for tender food
    // {number} x - x location in model coordinates
    // {number} z - z location in model coordinates
    const foodConfig = [
      { toughImage: toughFoodAImage, tenderImage: tenderFoodAImage, x: -65, z: 210 },
      { toughImage: toughFoodAImage, tenderImage: tenderFoodAImage, x: 155, z: 160 },
      { toughImage: toughFoodBImage, tenderImage: tenderFoodBImage, x: -155, z: 160 },
      { toughImage: toughFoodBImage, tenderImage: tenderFoodBImage, x: 200, z: 250 },
      { toughImage: toughFoodCImage, tenderImage: tenderFoodCImage, x: 60, z: 185 },
      { toughImage: toughFoodCImage, tenderImage: tenderFoodCImage, x: -180, z: 270 }
    ];

    // @public (read-only) individual food items
    this.food = [];
    for ( let i = 0; i < foodConfig.length; i++ ) {
      const config = foodConfig[ i ];
      this.food.push( new Food( config.toughImage, config.tenderImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( config.x, config.z ),
        tandem: options.tandem.createTandem( `food${i}` )
      } ) );
    }

    // When food is limited, hide half of the food
    this.isLimitedProperty.link( isLimited => {
      for ( let i = 0; i < this.food.length; i++ ) {
        this.food[ i ].visibleProperty.value = ( i % 2 === 0 || !isLimited );
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.isToughProperty.reset();
    this.isLimitedProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'FoodSupply does not support dispose' );
  }
}

naturalSelection.register( 'FoodSupply', FoodSupply );
export default FoodSupply;