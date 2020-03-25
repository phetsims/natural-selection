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

    // @public (read-only) individual food items, as labeled in
    // https://github.com/phetsims/natural-selection/issues/17
    this.food = [

      // Food 'A'
      new Food( 'A1', toughFoodAImage, tenderFoodAImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( -65, 210 )
      } ),
      new Food( 'A2', toughFoodAImage, tenderFoodAImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( 155, 160 )
      } ),

      // Food 'B'
      new Food( 'B1', toughFoodBImage, tenderFoodBImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( -155, 160 )
      } ),
      new Food( 'B2', toughFoodBImage, tenderFoodBImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( 200, 250 )
      } ),

      // Food 'C'
      new Food( 'C1', toughFoodCImage, tenderFoodCImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( 60, 185 )
      } ),
      new Food( 'C2', toughFoodCImage, tenderFoodCImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( -180, 270 )
      } )
    ];

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
    this.food.forEach( food => food.reset() );
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