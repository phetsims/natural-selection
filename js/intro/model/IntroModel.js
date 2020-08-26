// Copyright 2019-2020, University of Colorado Boulder

/**
 * IntroModel is the model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionModel from '../../common/model/NaturalSelectionModel.js';
import NaturalSelectionConstants from '../../common/NaturalSelectionConstants.js';
import naturalSelection from '../../naturalSelection.js';

/**
 * @constructor
 */
class IntroModel extends NaturalSelectionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    super( 'introMutations', 'introPopulation', NaturalSelectionConstants.INTRO_SHRUBS_SEED, {
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'IntroModel', IntroModel );
export default IntroModel;