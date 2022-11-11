// Copyright 2020-2022, University of Colorado Boulder

// @ts-nocheck
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
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';

export default class OrganismSpriteInstance extends SpriteInstance {

  /**
   * @param {Organism} organism
   * @param {Sprite} sprite
   * @param {number} baseScale - the base amount to scale, tuned based on the PNG file dimensions
   */
  constructor( organism, sprite, baseScale ) {
    // args are validated by initialize

    super();

    // Set field in super SpriteInstance. Every Organism needs to be both translated and scaled
    // because the view is a 2D projection of a 3D model position.
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_SCALE;

    // @private {function}
    this.organismListener = this.updateMatrix.bind( this );

    this.initialize( organism, sprite, baseScale );
  }

  /**
   * Initializes the OrganismSpriteInstance. This is factored out of the constructor (and is public) in case
   * we ever want to leverage SpriteInstance's Poolable features.
   * @param {Organism} organism
   * @param {Sprite} sprite
   * @param {number} baseScale
   * @protected for use by Poolable
   */
  initialize( organism, sprite, baseScale ) {

    assert && assert( organism instanceof Organism, 'invalid organism' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );
    assert && assert( NaturalSelectionUtils.isPositive( baseScale ), `invalid baseScale: ${baseScale}` );

    // Set fields in super SpriteInstance
    this.sprite = sprite;

    // @public (read-only)
    this.organism = organism;

    // @private
    this.baseScale = baseScale;

    // Update position and direction, unlink in dispose. Do not use a Multilink or define disposeOrganismSpriteInstance
    // because we will be creating a large number of OrganismSpriteInstance instances.
    assert && assert( this.organismListener, 'organismListener should exist by now' );
    this.organism.positionProperty.link( this.organismListener );
    this.organism.xDirectionProperty.link( this.organismListener );
  }

  /**
   * Updates the matrix to match the organism's position and xDirection.
   * @private
   */
  updateMatrix() {

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

  /**
   * @public
   * @override
   */
  dispose() {
    this.organism.positionProperty.unlink( this.organismListener );
    this.organism.xDirectionProperty.unlink( this.organismListener );
    super.dispose && super.dispose();
  }
}

naturalSelection.register( 'OrganismSpriteInstance', OrganismSpriteInstance );