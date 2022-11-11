// Copyright 2020-2022, University of Colorado Boulder

/**
 * OrganismSpriteImage is a specialization of SpriteImage for Organisms (bunnies, wolves, shrubs).
 * All organism images have their origin at the bottom-center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import { SpriteImage, SpriteImageOptions } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';

type SelfOptions = EmptySelfOptions;

type OrganismSpriteImageOptions = SelfOptions & PickOptional<SpriteImage, 'pickable' | 'hitTestPixels'>;

export default class OrganismSpriteImage extends SpriteImage {

  public constructor( image: HTMLImageElement, providedOptions?: OrganismSpriteImageOptions ) {

    assert && assert( image.width > 0 && image.height > 0, 'image does not have valid dimensions' );

    const options = optionize<OrganismSpriteImageOptions, SelfOptions, SpriteImageOptions>()( {

      // OrganismSpriteImageOptions
      pickable: false,
      mipmap: true
    }, providedOptions );

    // Origin at bottom-center
    const offset = new Vector2( image.width / 2, image.height );

    super( image, offset, options );
  }
}

naturalSelection.register( 'OrganismSpriteImage', OrganismSpriteImage );