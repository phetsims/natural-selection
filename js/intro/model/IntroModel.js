// Copyright 2019-2020, University of Colorado Boulder

/**
 * IntroModel is the model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionModel from '../../common/model/NaturalSelectionModel.js';
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
    super( tandem );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'IntroModel does not support dispose' );
  }
}

naturalSelection.register( 'IntroModel', IntroModel );
export default IntroModel;