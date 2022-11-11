// Copyright 2019-2022, University of Colorado Boulder

/**
 * EnvironmentNode displays everything in the environment -- bunnies, wolves, food, terrain, sky, etc.
 * This is the part of the UI where bunnies hop around, wolves hunt, and shrubs sit around waiting to be eaten.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions, Rectangle } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionModel from '../../model/NaturalSelectionModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import BunnyImageMap from '../BunnyImageMap.js';
import EnvironmentBackgroundNode from './EnvironmentBackgroundNode.js';
import OrganismSprites from './OrganismSprites.js';

type SelfOptions = {
  size?: Dimension2;
  yHorizon?: number;
};

type EnvironmentNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EnvironmentNode extends Node {

  private readonly sprites: OrganismSprites;

  public constructor( model: NaturalSelectionModel, bunnyImageMap: BunnyImageMap, providedOptions: EnvironmentNodeOptions ) {

    const options = optionize<EnvironmentNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      size: model.modelViewTransform.viewSize,
      yHorizon: model.modelViewTransform.yHorizonView,

      // NodeOptions
      phetioDocumentation: 'the area of the screen that displays what is happening in the environment',
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const bounds = new Bounds2( 0, 0, options.size.width, options.size.height );

    // The background, which changes to match the environment
    const backgroundNode = new EnvironmentBackgroundNode( model.environmentProperty, options.size,
      options.yHorizon );

    // Frame around the background, to provide a nice crisp border.
    const frameNode = new Rectangle( bounds, {
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // High-performance sprites, for rendering bunnies, wolves, and food.
    const sprites = new OrganismSprites( model.bunnyCollection, bunnyImageMap, model.wolfCollection, model.food,
      model.isPlayingProperty, bounds, {
        tandem: options.tandem.createTandem( 'sprites' )
      } );

    // layering
    options.children = [ backgroundNode, sprites, frameNode ];

    super( options );

    // Pressing on anything other than a bunny clears the selection. removeInputListener is not necessary.
    backgroundNode.addInputListener( {
      down: () => {
        model.bunnyCollection.selectedBunnyProperty.value = null;
      }
    } );

    this.sprites = sprites;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Updates all sprites.
   */
  public updateSprites(): void {
    this.sprites.update();
  }
}

naturalSelection.register( 'EnvironmentNode', EnvironmentNode );