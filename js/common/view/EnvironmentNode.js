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
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyCountsNode from './BunnyCountsNode.js';
import BunnyNodeCollection from './BunnyNodeCollection.js';
import BunnyPressListener from './BunnyPressListener.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import ShrubNode from './ShrubNode.js';
import WolfNodeCollection from './WolfNodeCollection.js';

class EnvironmentNode extends Node {

  /**
   * @param {NaturalSelectionModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    assert && assert( model instanceof NaturalSelectionModel, 'invalid model' );

    options = merge( {
      size: model.modelViewTransform.viewSize,
      yHorizon: model.modelViewTransform.yHorizonView,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'the area of the screen that displays what is happening in the environment'
    }, options );

    const backgroundNode = new EnvironmentBackgroundNode( model.environmentProperty, options.size,
      options.yHorizon );

    // Frame around the viewport, to provide a nice crisp border, and for layout of UI components.
    const frameNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // Parent for all SpriteNodes, clipped to the viewport
    const spritesNode = new Node( {
      children: [],
      clipArea: Shape.rect( 0, 0, options.size.width, options.size.height )
    } );

    // Add shrubs
    model.food.shrubs.forEach( shrub => {
      spritesNode.addChild( new ShrubNode( shrub ) );
    } );

    // layering
    assert && assert( !options.children, 'EnvironmentNode sets children' );
    options.children = [
      backgroundNode,
      spritesNode,
      frameNode
    ];

    super( options );

    // Show counts in the upper-left corner
    if ( NaturalSelectionConstants.SHOW_INFO ) {
      this.addChild( new BunnyCountsNode(
        model.bunnyCollection.liveBunnies.lengthProperty,
        model.bunnyCollection.deadBunnies.lengthProperty, {
          left: backgroundNode.left + 5,
          top: backgroundNode.top + 5
        } ) );
    }

    // manages dynamic BunnyNode instances
    const bunnyNodeCollection = new BunnyNodeCollection( model.bunnyCollection, model.pedigreeModel.selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'bunnyNodeCollection' )
    } );

    // Creates a BunnyNode and adds it to the scenegraph
    const createBunnyNode = bunny => {

      // PhET-iO state will restore both live and dead bunnies. Create BunnyNodes only for the live ones.
      if ( bunny.isAlive ) {
        const bunnyNode = bunnyNodeCollection.createBunnyNode( bunny );
        spritesNode.addChild( bunnyNode );
      }
    };

    // Create a BunnyNode for each Bunny in the initial population.
    model.bunnyCollection.liveBunnies.forEach( createBunnyNode );

    // When a Bunny is added to the model, create the corresponding BunnyNode.
    model.bunnyCollection.bunnyCreatedEmitter.addListener( createBunnyNode );

    // manages dynamic WolfNode instances
    const wolfNodeCollection = new WolfNodeCollection( model.wolfCollection, {
      tandem: options.tandem.createTandem( 'wolfNodeCollection' )
    } );

    // Creates a WolfNode and adds it to the scenegraph
    model.wolfCollection.wolfCreatedEmitter.addListener( wolf => {
      const wolfNode = wolfNodeCollection.createWolfNode( wolf );
      spritesNode.addChild( wolfNode );
      if ( !model.isPlayingProperty ) {
        this.sortSprites();
      }
    } );

    // Press on a bunny to select it. No need to removeInputListener, exists for the lifetime of the sim.
    spritesNode.addInputListener( new BunnyPressListener( model.pedigreeModel.selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'bunnyPressListener' )
    } ) );

    // Pressing on the background clears the selected bunny.
    // No need to removeInputListener, exists for the lifetime of the sim.
    backgroundNode.addInputListener( new PressListener( {
      press: () => {
        model.pedigreeModel.selectedBunnyProperty.value = null;
      },
      pressCursor: 'default',
      tandem: options.tandem.createTandem( 'backgroundPressListener' )
    } ) );

    // @private
    this.spritesNode = spritesNode;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EnvironmentNode does not support dispose' );
  }

  /**
   * @param {number} dt - time step, in seconds
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