// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModel from '../model/EnvironmentModel.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyNodeGroup from './BunnyNodeGroup.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import EnvironmentRadioButtonGroup from './EnvironmentRadioButtonGroup.js';
import FoodNode from './FoodNode.js';
import GenerationClockNode from './GenerationClockNode.js';
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
      environmentRadioButtonGroup
    ];

    super( options );

    // Create a link to the model that this Node displays
    this.addLinkedElement( environmentModel, {
      tandem: options.tandem.createTandem( 'environmentModel' )
    } );

    // @private PhetioGroup for managing dynamic BunnyNode instances
    this.bunnyNodeGroup = new BunnyNodeGroup( environmentModel.bunnies, environmentModel.selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'bunnyNodeGroup' )
    } );

    // Creates a BunnyNode and adds it to the scenegraph
    const createBunnyNode = bunny => {
      const bunnyNode = this.bunnyNodeGroup.createBunnyNode( bunny );
      spritesNode.addChild( bunnyNode );
    };

    // Create a BunnyNode for each Bunny in the initial population.
    environmentModel.bunnies.liveBunnies.forEach( createBunnyNode );

    // When a Bunny is added to the model, create the corresponding BunnyNode.
    environmentModel.bunnies.bunnyCreatedEmitter.addListener( createBunnyNode );

    // @private
    this.environmentModel = environmentModel;
    this.spritesNode = spritesNode;

    assert && assert( _.every( this.spritesNode.children, child => child instanceof SpriteNode ),
      'every child of spritesNode must be an instanceof SpriteNode' );

    // Press on the background to clear the selected bunny.
    // No need to removeInputListener, exists for the lifetime of the sim.
    backgroundNode.addInputListener( new PressListener( {
      press: () => {
        environmentModel.selectedBunnyProperty.value = null;
      },
      tandem: options.tandem.createTandem( 'pressListener' )
    } ) );
  }

  /**
   * @public
   */
  reset() {
    //TODO
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
    this.sortSprites();
  }

  /**
   * Sorts the SpriteNodes by descending position.z (furthest to closest)
   * @public
   */
  sortSprites() {
    this.spritesNode.children = _.sortBy(
      this.spritesNode.children,
      child => child.sprite.positionProperty.value.z
    ).reverse();
  }
}

naturalSelection.register( 'EnvironmentNode', EnvironmentNode );
export default EnvironmentNode;