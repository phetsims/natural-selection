// Copyright 2020, University of Colorado Boulder

/**
 * BunnyGroup is the PhetioGroup for Bunny.  It manages dynamic instances of Bunny.
 * All Bunny instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import Bunny from './Bunny.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';

class BunnyGroup extends PhetioGroup {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( modelViewTransform, genePool, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( BunnyIO ),
      phetioDocumentation: 'TODO'
    }, options );

    /**
     * Called to instantiate a Bunny. Note that modelViewTransform and genePool are passed via closure, so we don't
     * have to create it as part of defaultArguments, and don't have to deal with serializing it in BunnyIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Object} bunnyOptions - options to Bunny constructor, not actually optional, because createElement
     *                                must have a fixed number of args
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunnyOptions ) => {
      return new Bunny( modelViewTransform, genePool, merge( {}, bunnyOptions, {
        tandem: tandem
      } ) );
    };

    // defaultArguments, passed to createElement during API harvest (when running 'grunt generate-phet-io-api-files').
    const defaultArguments = [ {} ];

    super( createElement, defaultArguments, options );

    // @public (read-only)
    this.numberOfBunniesProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'numberOfBunniesProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the total number of bunnies, alive and dead'
    } );

    // @public notify when a bunny is created, a nicer API than addMemberCreatedListener
    this.bunnyCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when a bunny is disposed, a nicer API than addMemberDisposedListener
    this.bunnyDisposedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notify when a bunny dies
    this.bunnyDiedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // @public notifies when all bunnies have died
    this.allBunniesHaveDiedEmitter = new Emitter();

    // @public notifies when bunnies have taken over the world, exceeding the maximum population size
    this.bunniesHaveTakenOverTheWorldEmitter = new Emitter();

    // When a bunny is created...
    this.elementCreatedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );

      // When a bunny dies...
      const isAliveListener = isAlive => {
        if ( !isAlive ) {
          bunny.isAliveProperty.unlink( isAliveListener );

          this.bunnyDiedEmitter.emit( bunny );

          if ( this.getNumberOfLivingBunnies() === 0 ) {
            this.allBunniesHaveDiedEmitter.emit();
          }
        }
      };
      bunny.isAliveProperty.lazyLink( isAliveListener );

      this.numberOfBunniesProperty.value = this.length;
      this.bunnyCreatedEmitter.emit( bunny );

      // Notify if bunnies have taken over the world
      if ( this.getNumberOfLivingBunnies() > NaturalSelectionConstants.MAX_BUNNIES ) {
        this.bunniesHaveTakenOverTheWorldEmitter.emit();
      }
    } );

    // When a bunny is disposed...
    this.elementDisposedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.numberOfBunniesProperty.value = this.length;
      this.bunnyDisposedEmitter.emit( bunny );
    } );
  }

  /**
   * Resets the group.
   */
  reset() {
    this.clear();
  }

  /**
   * Gets the number of living bunnies.
   * @returns {number}
   */
  getNumberOfLivingBunnies() {
    let numberOfLivingBunnies = 0;
    this.forEach( bunny => {
      if ( bunny.isAlive ) {
        numberOfLivingBunnies++;
      }
    } );
    return numberOfLivingBunnies;
  }

  /**
   * Moves all bunnies that are alive.
   * @param {number} dt - time step, in seconds
   * @public
   */
  moveBunnies( dt ) {
    this.forEach( bunny => {
      if ( bunny.isAlive ) {
        bunny.step( dt );
      }
    } );
  }

  /**
   * Ages all bunnies that are alive. Bunnies that have reached their maximum age will die.
   * @public
   */
  ageBunnies() {
    this.forEach( bunny => {
      if ( bunny.isAlive ) {
        bunny.ageProperty.value++;
        if ( bunny.ageProperty.value === NaturalSelectionConstants.MAX_BUNNY_AGE ) {
          bunny.die();
        }
        assert && assert( bunny.ageProperty.value <= NaturalSelectionConstants.MAX_BUNNY_AGE,
          `bunny age exceeded max: ${bunny.ageProperty.value}` );
      }
    } );
  }
}

naturalSelection.register( 'BunnyGroup', BunnyGroup );
export default BunnyGroup;