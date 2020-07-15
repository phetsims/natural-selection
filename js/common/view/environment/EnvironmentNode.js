// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionModel from '../../model/NaturalSelectionModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import OrganismSprites from './OrganismSprites.js';

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

    const bounds = new Bounds2( 0, 0, options.size.width, options.size.height );

    // The background, which changes to match the environment
    const backgroundNode = new EnvironmentBackgroundNode( model.environmentProperty, options.size,
      options.yHorizon );

    // Frame around the background, to provide a nice crisp border.
    const frameNode = new Rectangle( bounds, {
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // High-performance sprites, for rendering bunnies, wolves, and food.
    const sprites = new OrganismSprites( model.bunnyCollection, model.wolfCollection, model.food,
      model.isPlayingProperty, bounds, options.tandem.createTandem( 'sprites' )
    );

    // layering
    assert && assert( !options.children, 'EnvironmentNode sets children' );
    options.children = [ backgroundNode, sprites, frameNode ];

    super( options );

    // Pressing on anything other than a bunny clears the selection. removeInputListener is not needed.
    backgroundNode.addInputListener( {
      down: () => {
        model.bunnyCollection.selectedBunnyProperty.value = null;
      }
    } );

    // @private
    this.sprites = sprites;
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
    this.updateSprites();
  }

  /**
   * Update all sprites.
   * @public
   */
  updateSprites() {
    this.sprites.update();
  }
}

naturalSelection.register( 'EnvironmentNode', EnvironmentNode );
export default EnvironmentNode;