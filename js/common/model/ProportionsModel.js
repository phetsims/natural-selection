// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model used by the Proportion view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const Property = require( 'AXON/Property' );
  const Tandem = require( 'TANDEM/Tandem' );

  class ProportionsModel extends PhetioObject {

    /**
     * @param {Property.<number>} currentGenerationProperty
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Tandem} tandem
     */
    constructor( currentGenerationProperty, isPlayingProperty, tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      super( {

        // phet-io
        tandem: tandem,
        phetioState: false // to prevent serialization, because we don't have an IO type
      } );

      // @public
      this.currentGenerationProperty = currentGenerationProperty;

      // @public
      this.valuesVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'valuesVisibleProperty' )
      } );

      // @public the generation that is displayed by the Proportions graph
      this.generationProperty = new NumberProperty( 0, {
        numberType: 'Integer',
        tandem: tandem.createTandem( 'generationProperty' ),
        phetioStudioControl: false //TODO range is dynamic
      } );

      //TODO phet-io instrumentation
      //TODO these should be derived from other model state
      // @public
      this.startCountProperty = new NumberProperty( 1, {
        numberType: 'Integer'
      } );
      this.endCountProperty = new NumberProperty( 50, {
        numberType: 'Integer'
      } );

      // Pause the sim when a generation other than the current generation is being viewed.
      this.generationProperty.link( generation => {
        if ( generation !== currentGenerationProperty.value ) {
          isPlayingProperty.value = false;
        }
      } );

      // When the sim starts playing or the current generation changes, show the current generation immediately.
      Property.multilink(
        [ isPlayingProperty, currentGenerationProperty ],
        ( isPlaying, currentGeneration ) => {
          if ( isPlaying ) {
            this.generationProperty.value = currentGeneration;
          }
        }
      );
    }

    /**
     * @public
     */
    reset() {
      this.valuesVisibleProperty.reset();
      this.generationProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'ProportionsModel does not support dispose' );
    }
  }

  return naturalSelection.register( 'ProportionsModel', ProportionsModel );
} );