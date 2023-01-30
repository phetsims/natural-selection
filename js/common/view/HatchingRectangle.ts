// Copyright 2019-2023, University of Colorado Boulder

/**
 * HatchingRectangle is a Rectangle that appears as if it's filled with a hatching pattern.
 * The hatching pattern is a set of equally-spaced parallel lines, arranged at some angle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Path, Rectangle, RectangleOptions, TColor } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = {
  hatchingOptions?: {
    stroke: TColor;
    lineWidth: number;
    rotation: number;
  };
};

type HatchingRectangleOptions = SelfOptions & PickRequired<RectangleOptions, 'fill' | 'stroke'>;

export default class HatchingRectangle extends Rectangle {

  private readonly linesPath: Path;
  private readonly hatchingLineWidth: number;

  public constructor( x: number, y: number, width: number, height: number, providedOptions?: HatchingRectangleOptions ) {

    const options = optionize<HatchingRectangleOptions, SelfOptions, RectangleOptions>()( {

      // SelfOptions
      hatchingOptions: {
        stroke: 'white',
        lineWidth: 2,
        rotation: -Math.PI / 4
      }
    }, providedOptions );

    super( 0, 0, width, height, options );

    this.hatchingLineWidth = options.hatchingOptions.lineWidth;

    this.linesPath = new Path( new Shape(), options.hatchingOptions );
    this.addChild( this.linesPath );

    // this.linesPath did not exist the first time that invalidateRectangle was called by super.
    this.invalidateRectangle();
  }

  /**
   * Notifies that the rectangle has changed, and invalidates path information and our cached shape.
   */
  protected override invalidateRectangle(): void {
    super.invalidateRectangle();

    // this.linesPath did not exist the first time that invalidateRectangle was called by super.
    if ( this.linesPath ) {

      // Draw equally-spaces lines on top of the rectangle to create a hatching pattern. The lines are drawn
      // horizontally as a single Shape, then rotated to the desired angle. The bounds of the lines is 2x the
      // largest dimensions of the rectangle, so that the hatching pattern can be rotated arbitrarily.
      let lineY = 0;
      const linesShape = new Shape();
      const maxDimension = Math.max( this.rectWidth, this.rectHeight );
      while ( lineY <= 2 * maxDimension ) {
        linesShape.moveTo( 0, lineY ).lineTo( 2 * maxDimension, lineY );
        lineY = lineY + 2 * this.hatchingLineWidth;
      }
      this.linesPath.setShape( linesShape );

      // Center hatching lines in the rectangle
      this.linesPath.centerX = this.rectX + this.rectWidth / 2;
      this.linesPath.centerY = this.rectY + this.rectHeight / 2;
    }

    // Clip to the shape of the rectangle
    this.clipArea = this.shape;
  }
}

naturalSelection.register( 'HatchingRectangle', HatchingRectangle );