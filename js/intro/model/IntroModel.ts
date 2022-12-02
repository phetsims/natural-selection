// Copyright 2019-2022, University of Colorado Boulder

/**
 * IntroModel is the model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionModel from '../../common/model/NaturalSelectionModel.js';
import NaturalSelectionConstants from '../../common/NaturalSelectionConstants.js';
import naturalSelection from '../../naturalSelection.js';

export default class IntroModel extends NaturalSelectionModel {

  public constructor( tandem: Tandem ) {
    super( 'intro', NaturalSelectionConstants.INTRO_SHRUBS_SEED, {
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'IntroModel', IntroModel );