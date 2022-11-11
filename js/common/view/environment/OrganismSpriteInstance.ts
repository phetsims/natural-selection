// Copyright 2020-2022, University of Colorado Boulder

/**
 * OrganismSpriteInstance is a specialization of SpriteInstance for organisms (bunnies, wolves, shrubs).
 * It keeps a reference to the associated organism, and updates its transformation matrix to match the
 * organism's position and direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Sprite, SpriteInstance, SpriteInstanceTransformType } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Organism from '../../model/Organism.js';
import XDirection from '../../model/XDirection.js';

export default class OrganismSpriteInstance extends SpriteInstance {

  public readonly organism: Organism;
  private readonly baseScale: number;
  private readonly organismListener: () => void;

  /**
   * @param organism
   * @param sprite
   * @param baseScale - the base amount to scale, tuned based on the PNG file dimensions
   */
  public constructor( organism: Organism, sprite: Sprite, baseScale: number ) {

    assert && assert( baseScale > 0, `invalid baseScale: ${baseScale}` );

    super();

    this.organism = organism;
    this.baseScale = baseScale;

    // this.sprite is a field in super SpriteInstance
    this.sprite = sprite;

    // this.transformType is a field in super SpriteInstance.
    // Every Organism needs to be both translated and scaled because the view is a 2D projection of a 3D model position.
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_SCALE;

    this.organismListener = this.updateMatrix.bind( this );

    // Update position and direction, unlink in dispose. Do not use a Multilink or define disposeOrganismSpriteInstance
    // because we will be creating a large number of OrganismSpriteInstance instances.
    this.organism.positionProperty.link( this.organismListener );
    this.organism.xDirectionProperty.link( this.organismListener );
  }

  /**
   * Updates the matrix to match the organism's position and xDirection.
   */
  private updateMatrix(): void {

    const position = this.organism.positionProperty.value;
    const xDirection = this.organism.xDirectionProperty.value;

    // compute scale and position, in view coordinates
    const viewScale = this.baseScale * this.organism.modelViewTransform.getViewScale( position.z );
    const viewX = this.organism.modelViewTransform.modelToViewX( position );
    const viewY = this.organism.modelViewTransform.modelToViewY( position );

    // update the matrix in the most efficient way possible
    this.matrix.set00( viewScale * XDirection.toSign( xDirection ) ); // reflected to account for x direction
    this.matrix.set11( viewScale );
    this.matrix.set02( viewX );
    this.matrix.set12( viewY );
    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );
  }

  public dispose(): void {
    this.organism.positionProperty.unlink( this.organismListener );
    this.organism.xDirectionProperty.unlink( this.organismListener );
  }
}

naturalSelection.register( 'OrganismSpriteInstance', OrganismSpriteInstance );