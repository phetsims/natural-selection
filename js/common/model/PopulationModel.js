// Copyright 2019, University of Colorado Boulder

/**
 * PopulationModel is the sub-model used by the Population view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DataProbe = require( 'NATURAL_SELECTION/common/model/DataProbe' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  // constants

  // The default index into Y_MAXIMUMS, determines the initial y-axis scale.
  const Y_MAXIMUMS_INDEX_DEFAULT = 3;

  // Maximum population values for the y-axis scale.
  const Y_MAXIMUMS = [ 5, 14, 30, 50, 70, 100, 140, 200, 240, 350, 500, 1000, 2000, 3000, 5000 ];
  assert && assert( _.every( value => Util.isInteger( value ) ), 'Y_MAXIMUMS must contain integer values' );
  //TODO assert that Y_MAXIMUMS values are in ascending order

  // Spacing of tick marks for each y-axis scale in Y_MAXIMUMS.
  const Y_TICK_SPACINGS = [ 1, 2, 5, 5, 10, 10, 20, 20, 20, 50, 50, 100, 200, 200, 500 ];
  assert && assert( Y_TICK_SPACINGS.length === Y_MAXIMUMS.length, 'incorrect number of Y_TICK_SPACINGS' );
  assert && assert( _.every( value => Util.isInteger( value ) ), 'Y_TICK_SPACINGS must contain integer values' );

  class PopulationModel {

    /**
     * @param {Property.<number>} generationsProperty
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Tandem} tandem
     */
    constructor( generationsProperty, isPlayingProperty, tandem ) {

      // @public
      this.generationsProperty = generationsProperty;
      this.isPlayingProperty = isPlayingProperty;

      // @public
      this.dataProbe = new DataProbe( tandem.createTandem( 'dataProbe' ) );

      // @public visibility of the total population plot on the graph and data probe
      this.totalVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'totalVisibleProperty' )
      } );

      // @public visibility of the plot for each allele on the graph and data probe
      this.whiteFurVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'whiteFurVisibleProperty' )
      } );
      this.brownFurVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'brownFurVisibleProperty' )
      } );
      this.straightEarsVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'straightEarsVisibleProperty' )
      } );
      this.floppyEarsVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'floppyEarsVisibleProperty' )
      } );
      this.shortTeethVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'shortTeethVisibleProperty' )
      } );
      this.longTeethVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'longTeethVisibleProperty' )
      } );

      // @public (read-only) the width of the x-axis scale, in generations
      this.xAxisWidth = 5;

      // @public (read-only) spacing between x-axis tick marks, in generations
      this.xAxisTickSpacing = 1;

      // @public maximum of graph's x-axis scale, in generations.
      // We're storing only the max since it's expensive to create a new Range on every clock tick.
      this.xMaximumProperty = new NumberProperty( this.xAxisWidth, {
        isValidValue: value => ( value >= 0 ),
        tandem: tandem.createTandem( 'xMaximumProperty' ),
        phetioStudioControl: false //TODO range is dynamic, and changes on every clock tick
      } );

      // @public index into Y_MAXIMUMS
      this.yZoomIndexProperty = new NumberProperty( Y_MAXIMUMS_INDEX_DEFAULT, {
        numberType: 'Integer',
        range: new Range( 0, Y_MAXIMUMS.length - 1 ),
        tandem: tandem.createTandem( 'yZoomIndexProperty' )
      } );

      // @public maximum of graph's y-axis scale, in population
      // We're storing only the max since the min is always zero.
      this.yMaximumProperty = new DerivedProperty(
        [ this.yZoomIndexProperty ],
        index => Y_MAXIMUMS[ index ], {
          phetioType: DerivedPropertyIO( NumberIO ),
          tandem: tandem.createTandem( 'yMaximumProperty' )
        } );
      phet.log && this.yMaximumProperty.link(
        yAxisMax => phet.log( `yAxisMax=${yAxisMax}` )
      );

      // Scrolls the x-axis so that xMax is 'now'.
      const scrollToNow = () => {
        this.xMaximumProperty.value = Math.max( generationsProperty.value, this.xAxisWidth );
      };

      // When generations changes, scroll the x-axis.
      generationsProperty.link( () => scrollToNow() );

      // When the sim starts playing, scroll the x-axis.
      isPlayingProperty.link( isPlaying => {
        if ( isPlaying ) {
          scrollToNow();
        }
      } );
    }

    /**
     * @public
     */
    reset() {
      this.dataProbe.reset();

      this.totalVisibleProperty.reset();
      this.whiteFurVisibleProperty.reset();
      this.brownFurVisibleProperty.reset();
      this.straightEarsVisibleProperty.reset();
      this.floppyEarsVisibleProperty.reset();
      this.shortTeethVisibleProperty.reset();
      this.longTeethVisibleProperty.reset();

      this.xMaximumProperty.reset();
      this.yZoomIndexProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'PopulationModel does not support dispose' );
    }

    /**
     * Gets the y-axis tick mark spacing for the current y-axis scale.
     * @returns {number}
     * @public
     */
    getYTickSpacing() {
      return Y_TICK_SPACINGS[ this.yZoomIndexProperty.value ];
    }
  }

  return naturalSelection.register( 'PopulationModel', PopulationModel );
} );