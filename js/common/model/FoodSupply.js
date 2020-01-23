// Copyright 2020, University of Colorado Boulder

/**
 * FoodSupply is the model of the food supply.  It controls the type and quantity of food available to the bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Food = require( 'NATURAL_SELECTION/common/model/Food' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Tandem = require( 'TANDEM/Tandem' );

  // images
  const tenderFoodAImage = require( 'image!NATURAL_SELECTION/tenderFoodA' );
  const tenderFoodBImage = require( 'image!NATURAL_SELECTION/tenderFoodB' );
  const tenderFoodCImage = require( 'image!NATURAL_SELECTION/tenderFoodC' );
  const toughFoodAImage = require( 'image!NATURAL_SELECTION/toughFoodA' );
  const toughFoodBImage = require( 'image!NATURAL_SELECTION/toughFoodB' );
  const toughFoodCImage = require( 'image!NATURAL_SELECTION/toughFoodC' );

  class FoodSupply {

    /**
     * @param {EnvironmentModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( modelViewTransform, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public (read-only) individual food items, as specified in
      // https://github.com/phetsims/natural-selection/issues/17
      this.food = [

        // Food 'A'
        new Food( 'A1', toughFoodAImage, tenderFoodAImage, {
          position: modelViewTransform.getGroundPosition( -65, 210 )
        } ),
        new Food( 'A2', toughFoodAImage, tenderFoodAImage, {
          position: modelViewTransform.getGroundPosition( 155, 160 )
        } ),

        // Food 'B'
        new Food( 'B1', toughFoodBImage, tenderFoodBImage, {
          position: modelViewTransform.getGroundPosition( -155, 160 )
        } ),
        new Food( 'B2', toughFoodBImage, tenderFoodBImage, {
          position: modelViewTransform.getGroundPosition( 200, 250 )
        } ),

        // Food 'C'
        new Food( 'C1', toughFoodCImage, tenderFoodCImage, {
          position: modelViewTransform.getGroundPosition( 60, 185 )
        } ),
        new Food( 'C2', toughFoodCImage, tenderFoodCImage, {
          position: modelViewTransform.getGroundPosition( -180, 270 )
        } )
      ];

      // @public
      this.isToughProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'isToughProperty' )
      } );
      this.isToughProperty.link( isTough => {

        // Adjust each food item
        for ( let i = 0; i < this.food.length; i++ ) {
          this.food[ i ].isToughProperty.value = isTough;
        }
      } );

      // @public
      this.isLimitedProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'isLimitedProperty' )
      } );
      this.isLimitedProperty.link( isLimited => {

        // When food is limited, hide half of the food
        for ( let i = 0; i < this.food.length; i++ ) {
          this.food[ i ].visibleProperty.value = ( i % 2 === 0 || !isLimited );
        }
      } );
    }

    /**
     * @public
     */
    reset() {
      _.forEach( this.food, food => food.reset() );
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

  return naturalSelection.register( 'FoodSupply', FoodSupply );
} );