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
  const EnvironmentBackgroundNode = require( 'NATURAL_SELECTION/common/view/EnvironmentBackgroundNode' );
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
     * @param {NaturalSelectionModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = merge( {
        viewportSize: NaturalSelectionConstants.ENVIRONMENT_DISPLAY_SIZE,
        viewportHorizonY: NaturalSelectionConstants.ENVIRONMENT_DISPLAY_HORIZON_Y,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const backgroundNode = new EnvironmentBackgroundNode( model.environmentModel.environmentProperty,
        options.viewportSize, options.viewportHorizonY );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ backgroundNode ],
        clipArea: Shape.rect( 0, 0, options.viewportSize.width, options.viewportSize.height )
      } );

      // Frame around the viewport, to provide a nice crisp border, and for layout of UI components.
      const frameNode = new Rectangle( 0, 0, options.viewportSize.width, options.viewportSize.height, {
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      // Generation clock
      const generationClockNode = new GenerationClockNode( model.generationClock,
        model.environmentModel.environmentalFactorEnabledProperty, {
          centerX: frameNode.centerX,
          top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
          tandem: options.tandem.createTandem( 'generationClockNode' )
        } );

      // Environment radio buttons
      const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( model.environmentModel.environmentProperty, {
        right: frameNode.right - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_X_MARGIN,
        top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'environmentRadioButtonGroup' )
      } );

      // 'Add a Mate' push button
      const addAMateButton = new AddAMateButton( {
        listener: () => {
          model.environmentModel.mateWasAddedProperty.value = true;
          addAMateButton.visible = false;
          //TODO
        },
        visible: !model.environmentModel.mateWasAddedProperty.value,
        centerX: frameNode.centerX,
        bottom: frameNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAMateButton' )
      } );

      // 'Play' push button
      const playButton = new PlayButton( {
        center: frameNode.center,
        visible: false, //TODO
        listener: () => {
          //TODO
        },
        tandem: options.tandem.createTandem( 'playButton' )
      } );

      // 'Play Again' push button
      const playAgainButton = new PlayAgainButton( {
        center: frameNode.center,
        visible: false, //TODO
        listener: () => {
          //TODO
        },
        tandem: options.tandem.createTandem( 'playAgainButton' )
      } );

      // Add food
      for ( let i = 0; i < model.environmentModel.food.length; i++ ) {
        worldContents.addChild( new FoodNode( model.environmentModel.food[ i ], model.environmentModel.landscape ) );
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
      this.resetEnvironmentNode = () => {
        addAMateButton.visible = true;
      };
    }

    /**
     * @public
     */
    reset() {
      this.resetEnvironmentNode();
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