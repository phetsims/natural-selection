// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionModel from '../../common/model/NaturalSelectionModel.js';
import naturalSelection from '../../naturalSelection.js';

/**
 * @constructor
 */
class LabModel extends NaturalSelectionModel {

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
    assert && assert( false, 'LabModel does not support dispose' );
  }
}

naturalSelection.register( 'LabModel', LabModel );
export default LabModel;