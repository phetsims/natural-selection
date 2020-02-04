// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const BunnyNode = require( 'NATURAL_SELECTION/common/view/BunnyNode' );
  const EnvironmentBackgroundNode = require( 'NATURAL_SELECTION/common/view/EnvironmentBackgroundNode' );
  const EnvironmentModel = require( 'NATURAL_SELECTION/common/model/EnvironmentModel' );
  const EnvironmentRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/EnvironmentRadioButtonGroup' );
  const FoodNode = require( 'NATURAL_SELECTION/common/view/FoodNode' );
  const GenerationClockNode = require( 'NATURAL_SELECTION/common/view/GenerationClockNode' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayButton = require( 'NATURAL_SELECTION/common/view/PlayButton' );
  const PlayAgainButton = require( 'NATURAL_SELECTION/common/view/PlayAgainButton' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );

  class EnvironmentNode extends Node {

    /**
     * @param {EnvironmentModel} environmentModel
     * @param {Object} [options]
     */
    constructor( environmentModel, options ) {

      assert && assert( environmentModel instanceof EnvironmentModel, 'invalid environmentModel' );

      options = merge( {
        size: environmentModel.modelViewTransform.viewSize,
        yHorizon: environmentModel.modelViewTransform.yHorizonView,

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioDocumentation: 'the area of the screen that displays what is happening in the environment'
      }, options );

      const backgroundNode = new EnvironmentBackgroundNode( environmentModel.environmentProperty, options.size,
        options.yHorizon );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ backgroundNode ],
        clipArea: Shape.rect( 0, 0, options.size.width, options.size.height )
      } );

      // Frame around the viewport, to provide a nice crisp border, and for layout of UI components.
      const frameNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      // Generation clock
      const generationClockNode = new GenerationClockNode( environmentModel.generationClock,
        environmentModel.environmentalFactorEnabledProperty, {
          centerX: frameNode.centerX,
          top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
          tandem: options.tandem.createTandem( 'generationClockNode' )
        } );

      // Environment radio buttons
      const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( environmentModel.environmentProperty, {
        right: frameNode.right - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_X_MARGIN,
        top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'environmentRadioButtonGroup' )
      } );

      // 'Add a Mate' push button
      const addAMateButton = new AddAMateButton( {
        listener: () => {
          addAMateButton.visible = false;
          environmentModel.addRandomBunny();
          environmentModel.generationClock.isRunningProperty.value = true;
        },
        centerX: frameNode.centerX,
        bottom: frameNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAMateButton' )
      } );

      // 'Play' push button
      const playButton = new PlayButton( {
        listener: () => {
          playButton.visible = false;
          environmentModel.generationClock.isRunningProperty.value = true;
        },
        center: addAMateButton.center,
        tandem: options.tandem.createTandem( 'playButton' )
      } );

      // 'Play Again' push button
      const playAgainButton = new PlayAgainButton( {
        center: addAMateButton.center,
        listener: () => {
          playAgainButton.visible = false;
          //TODO
        },
        tandem: options.tandem.createTandem( 'playAgainButton' )
      } );

      // Add food items
      const food = environmentModel.foodSupply.food;
      for ( let i = 0; i < food.length; i++ ) {
        worldContents.addChild( new FoodNode( food[ i ] ) );
      }

      // layering
      assert && assert( !options.children, 'EnvironmentNode sets children' );
      options.children = [
        worldContents,
        frameNode,
        generationClockNode,
        environmentRadioButtonGroup,
        addAMateButton,
        playButton,
        playAgainButton
      ];

      super( options );

      // @private
      this.initializeButtons = () => {
        addAMateButton.visible = ( environmentModel.numberOfBunniesProperty.value === 1 );
        playButton.visible = ( environmentModel.numberOfBunniesProperty.value > 1 );
        playAgainButton.visible = false;
      };
      this.initializeButtons();

      // Create a link to the model that this Node displays
      this.addLinkedElement( environmentModel, {
        tandem: options.tandem.createTandem( 'environmentModel' )
      } );

      // Create the view for each bunny
      environmentModel.bunnies.forEach( bunny => {
        worldContents.addChild( new BunnyNode( bunny ) );
        //TODO sort by positionProperty.value.z
      } );

      // When a bunny is added to the model, create its view
      environmentModel.bunnyAddedEmitter.addListener( bunny => {
        worldContents.addChild( new BunnyNode( bunny ) );
        //TODO sort by positionProperty.value.z
      } );
    }

    /**
     * @public
     */
    reset() {
      this.initializeButtons();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'EnvironmentNode does not support dispose' );
    }
  }

  return naturalSelection.register( 'EnvironmentNode', EnvironmentNode );
} );