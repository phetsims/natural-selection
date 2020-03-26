// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentModel is the sub-model that encapsulates the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import Bunny from './Bunny.js';
import BunnyGroup from './BunnyGroup.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Environments from './Environments.js';
import FoodSupply from './FoodSupply.js';
import GenerationClock from './GenerationClock.js';
import SpriteDirection from './SpriteDirection.js';
import Wolves from './Wolves.js';

class EnvironmentModel extends PhetioObject {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {

      // phet-io
      tandem: tandem,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'portion of the model that deals with the environment'
    } );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: tandem.createTandem( 'generationClock' )
    } );

    // @public
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public
    this.environmentProperty = new EnumerationProperty( Environments, Environments.EQUATOR, {
      tandem: tandem.createTandem( 'environmentProperty' )
    } );

    // @public (read-only)
    this.wolves = new Wolves( this.modelViewTransform, {
      tandem: tandem.createTandem( 'wolves' )
    } );

    // @public (read-only)
    this.foodSupply = new FoodSupply( this.modelViewTransform, {
      tandem: tandem.createTandem( 'foodSupply' )
    } );

    // @public whether any environmental factor is enabled
    this.environmentalFactorEnabledProperty = new DerivedProperty(
      [ this.wolves.enabledProperty, this.foodSupply.isToughProperty, this.foodSupply.isLimitedProperty ],
      ( wolvesEnabled, foodIsTough, foodIsLimited ) => ( wolvesEnabled || foodIsTough || foodIsLimited )
    );

    // @public (read-only) {PhetioGroup} to create Bunny instances
    this.bunnyGroup = new BunnyGroup( this.modelViewTransform, {
      tandem: tandem.createTandem( 'bunnyGroup' )
    } );

    this.initializeBunnyPopulation();
  }

  /**
   * @public
   */
  reset() {
    phet.log && phet.log( 'EnvironmentModel.reset' );

    this.generationClock.reset();

    // reset Properties
    this.environmentProperty.reset();
    this.wolves.reset();
    this.foodSupply.reset();

    // dispose of all bunnies and reinitialize
    this.bunnyGroup.clear();
    this.initializeBunnyPopulation();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EnvironmentModel does not support dispose' );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // step the generation clock
    this.generationClock.step( dt );

    // step the bunnies
    const numberOfBunnies = this.bunnyGroup.length;
    for ( let i = 0; i < numberOfBunnies; i++ ) {
      this.bunnyGroup.get( i ).step( dt );
    }
  }

  /**
   * Resets the initial bunny population. Other settings are preserved.
   * @public
   */
  playAgain() {
    phet.log && phet.log( 'EnvironmentModel.playAgain' );

    // dispose of all bunnies and reinitialize
    this.bunnyGroup.clear();
    this.initializeBunnyPopulation();
  }

  /**
   * Initializes the bunny population.
   * @private
   */
  initializeBunnyPopulation() {
    phet.log && phet.log( 'EnvironmentModel.initializeBunnyPopulation' );
    assert && assert( this.bunnyGroup.length === 0, 'bunnies already exist' );

    //TODO read query parameters and create initial population
    for ( let i = 0; i < NaturalSelectionQueryParameters.population; i++ ) {
      this.addRandomBunny();
    }
  }

  /**
   * Adds a bunny at a random position.
   * @returns {Bunny}
   * @public
   */
  addRandomBunny() {
    return this.bunnyGroup.createNextMember( {
      position: this.modelViewTransform.getRandomGroundPosition(),
      direction: phet.joist.random.nextBoolean() ? SpriteDirection.RIGHT : SpriteDirection.LEFT
    } );
  }

  /**
   * Removes a bunny from the collection.
   * @param {Bunny} bunny
   * @private
   */
  removeBunny( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    this.bunnyGroup.disposeMember( bunny );
  }
}

naturalSelection.register( 'EnvironmentModel', EnvironmentModel );
export default EnvironmentModel;