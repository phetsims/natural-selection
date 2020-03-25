// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModel from '../model/EnvironmentModel.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import AddAMateButton from './AddAMateButton.js';
import BunnyNode from './BunnyNode.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import EnvironmentRadioButtonGroup from './EnvironmentRadioButtonGroup.js';
import FoodNode from './FoodNode.js';
import GenerationClockNode from './GenerationClockNode.js';
import PlayAgainButton from './PlayAgainButton.js';
import PlayButton from './PlayButton.js';
import SpriteNode from './SpriteNode.js';

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

    // Parent for all SpriteNodes, clipped to the viewport
    const spritesNode = new Node( {
      children: [],
      clipArea: Shape.rect( 0, 0, options.size.width, options.size.height )
    } );

    // Add food items
    const food = environmentModel.foodSupply.food;
    for ( let i = 0; i < food.length; i++ ) {
      spritesNode.addChild( new FoodNode( food[ i ] ) );
    }

    // layering
    assert && assert( !options.children, 'EnvironmentNode sets children' );
    options.children = [
      backgroundNode,
      spritesNode,
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
    environmentModel.bunnyGroup.forEach( bunny => {
      spritesNode.addChild( new BunnyNode( bunny ) );
      //TODO sort by positionProperty.value.z
    } );

    // When a bunny is added to the model, create its view
    environmentModel.bunnyGroup.addMemberCreatedListener( bunny => {
      spritesNode.addChild( new BunnyNode( bunny ) );
      //TODO sort by positionProperty.value.z
    } );

    // @private
    this.environmentModel = environmentModel;
    this.spritesNode = spritesNode;

    assert && assert( _.every( this.spritesNode.children, child => child instanceof SpriteNode ),
      'every child of spritesNode must be an instanceof SpriteNode' );
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

  /**
   * @param dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // Sort the SpriteNodes by decreasing position.z
    this.spritesNode.children = _.sortBy(
      this.spritesNode.children,
      child => child.sprite.positionProperty.value.z
    ).reverse();
  }
}

naturalSelection.register( 'EnvironmentNode', EnvironmentNode );
export default EnvironmentNode;