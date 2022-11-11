// Copyright 2020-2022, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism, { OrganismOptions } from './Organism.js';

type SelfOptions = EmptySelfOptions;

type ShrubOptions = SelfOptions & OrganismOptions;

export default class Shrub extends Organism {

  public constructor( modelViewTransform: EnvironmentModelViewTransform, options?: ShrubOptions ) {
    super( modelViewTransform, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'Shrub', Shrub );