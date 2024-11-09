// Copyright 2020-2024, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism, { OrganismOptions } from './Organism.js';

type SelfOptions = EmptySelfOptions;

type ShrubOptions = SelfOptions & StrictOmit<OrganismOptions, 'isDisposable'>;

export default class Shrub extends Organism {

  public constructor( modelViewTransform: EnvironmentModelViewTransform, providedOptions?: ShrubOptions ) {
    super( modelViewTransform, optionize<ShrubOptions, SelfOptions, OrganismOptions>()( {
      isDisposable: false
    }, providedOptions ) );
  }
}

naturalSelection.register( 'Shrub', Shrub );