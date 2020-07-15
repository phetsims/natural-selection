// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import PressListener from '../../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionModel from '../../model/NaturalSelectionModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import EnvironmentBunnyNode from './EnvironmentBunnyNode.js';
import EnvironmentBunnyPressListener from './EnvironmentBunnyPressListener.js';
import OrganismSprites from './OrganismSprites.js';
import ShrubNode from './ShrubNode.js';
import WolfNode from './WolfNode.js';

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

    // The background, which changes to match the environment
    const backgroundNode = new EnvironmentBackgroundNode( model.environmentProperty, options.size,
      options.yHorizon );

    // Frame around the background, to provide a nice crisp border.
    const frameNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // Parent for all instances of OrganismNode, clipped to the backgroundNode
    const organismsNode = new Node( {
      preventFit: true, // a slight performance improvement
      children: [],
      clipArea: Shape.rect( 0, 0, options.size.width, options.size.height )
    } );

    // Add shrubs
    model.food.shrubs.forEach( shrub => {
      organismsNode.addChild( new ShrubNode( shrub ) );
    } );

    // High-performance sprites, for rendering bunnies, wolves, and food.
    const organismSprites = new OrganismSprites(
      model.bunnyCollection, model.wolfCollection, model.food,
      new Bounds2( 0, 0, options.size.width, options.size.height ),
      options.tandem.createTandem( 'organismSprites' )
    );

    // layering
    assert && assert( !options.children, 'EnvironmentNode sets children' );
    options.children = [
      backgroundNode,
      NaturalSelectionQueryParameters.sprites ? organismSprites : organismsNode,
      frameNode
    ];

    super( options );

    // Creates a BunnyNode and adds it to the scenegraph
    const createBunnyNode = bunny => {

      // PhET-iO state will restore both live and dead bunnies. Create BunnyNodes only for the live ones.
      if ( bunny.isAlive ) {

        const bunnyNode = new EnvironmentBunnyNode( bunny, model.bunnyCollection.selectedBunnyProperty );
        organismsNode.addChild( bunnyNode );

        // If the bunny dies or is disposed, dispose of the associated BunnyNode.
        const disposeBunnyNode = () => {
          bunny.diedEmitter.removeListener( disposeBunnyNode );
          bunny.disposedEmitter.removeListener( disposeBunnyNode );
          bunnyNode.dispose();
        };
        bunny.diedEmitter.addListener( disposeBunnyNode );
        bunny.disposedEmitter.addListener( disposeBunnyNode );
      }
    };

    // Create a BunnyNode for each Bunny in the initial population.
    model.bunnyCollection.liveBunnies.forEach( createBunnyNode );

    // When a Bunny is added to the model, create the corresponding BunnyNode. removeListener is not necessary.
    model.bunnyCollection.bunnyCreatedEmitter.addListener( createBunnyNode );

    // Press on a bunny to select it. No need to removeInputListener, exists for the lifetime of the sim.
    organismsNode.addInputListener( new EnvironmentBunnyPressListener( model.bunnyCollection.selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'bunnyPressListener' )
    } ) );

    // Pressing on the background clears the selected bunny.
    // No need to removeInputListener, exists for the lifetime of the sim.
    backgroundNode.addInputListener( new PressListener( {
      press: () => {
        model.bunnyCollection.selectedBunnyProperty.value = null;
      },
      pressCursor: 'default',
      tandem: options.tandem.createTandem( 'backgroundPressListener' )
    } ) );

    // Creates a WolfNode and adds it to the scenegraph. removeListener is not necessary.
    model.wolfCollection.wolfCreatedEmitter.addListener( wolf => {

      const wolfNode = new WolfNode( wolf );
      organismsNode.addChild( wolfNode );

      // When the wolf is disposed, dispose of the associated WolfNode.
      // removeListener is not necessary, because wolf.disposeEmitter is disposed.
      wolf.disposedEmitter.addListener( () => {
        wolfNode.dispose();
      } );

      if ( !model.isPlayingProperty ) {
        this.sortOrganisms();
      }
    } );

    // @private
    this.organismsNode = organismsNode;
    this.organismSprites = organismSprites;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Steps the view. This called after model.step by Sim.js.
   * @param {number} dt - the time step, in seconds
   * @public
   */
  step( dt ) {
    this.sortOrganisms();
    this.organismSprites.update();
  }

  /**
   * Sorts the OrganismNodes by descending position.z (furthest to closest)
   * @public
   */
  sortOrganisms() {
    this.organismsNode.children = _.sortBy(
      this.organismsNode.children,
      child => child.organism.positionProperty.value.z
    ).reverse();
  }
}

naturalSelection.register( 'EnvironmentNode', EnvironmentNode );
export default EnvironmentNode;