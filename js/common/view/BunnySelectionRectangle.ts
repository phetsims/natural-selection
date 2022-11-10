// Copyright 2020-2022, University of Colorado Boulder

/**
 * BunnySelectionRectangle is the rectangle that appears around the selected bunny in the environment and
 * in the Pedigree graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { NodeTranslationOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type BunnySelectionRectangleOptions = SelfOptions & NodeTranslationOptions & PickOptional<RectangleOptions, 'lineWidth'>;

export default class BunnySelectionRectangle extends Rectangle {

  public constructor( bounds: Bounds2, providedOptions?: BunnySelectionRectangleOptions ) {

    const options = optionize<BunnySelectionRectangleOptions, SelfOptions, RectangleOptions>()( {

      // RectangleOptions
      fill: NaturalSelectionColors.BUNNY_SELECTION_RECTANGLE_FILL,
      stroke: NaturalSelectionColors.BUNNY_SELECTION_RECTANGLE_STROKE,
      lineWidth: 2,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      pickable: false
    }, providedOptions );

    super( bounds, options );
  }
}

naturalSelection.register( 'BunnySelectionRectangle', BunnySelectionRectangle );