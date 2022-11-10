// Copyright 2019-2022, University of Colorado Boulder

/**
 * MutationIconNode is the mutation icon that appears in the Pedigree tree and 'Add Mutations' panel.
 * It looks like a DNA helix.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { Circle, Node, NodeOptions, NodeTranslationOptions, Path } from '../../../../scenery/js/imports.js';
import dnaSolidShape from '../../../../sherpa/js/fontawesome-5/dnaSolidShape.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = {
  radius?: number;
};

type MutationIconNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'pickable'>;

export default class MutationIconNode extends Node {

  public constructor( providedOptions?: MutationIconNodeOptions ) {

    const options = optionize<MutationIconNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      radius: 12
    }, providedOptions );

    // Yellow circle
    const circle = new Circle( options.radius, {
      fill: 'rgb( 250, 244, 77 )',
      stroke: 'black'
    } );

    // DNA icon centered in the circle
    const icon = new Path( dnaSolidShape, {
      fill: 'black'
    } );
    const scale = ( 0.6 * circle.height ) / Math.max( icon.width, icon.height );
    icon.setScaleMagnitude( scale );
    icon.center = circle.center;

    options.children = [ circle, icon ];

    super( options );
  }
}

naturalSelection.register( 'MutationIconNode', MutationIconNode );