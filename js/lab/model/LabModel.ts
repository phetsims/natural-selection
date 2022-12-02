// Copyright 2019-2022, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionModel from '../../common/model/NaturalSelectionModel.js';
import NaturalSelectionConstants from '../../common/NaturalSelectionConstants.js';
import naturalSelection from '../../naturalSelection.js';

export default class LabModel extends NaturalSelectionModel {

  public constructor( tandem: Tandem ) {
    super( 'lab', NaturalSelectionConstants.LAB_SHRUBS_SEED, {
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'LabModel', LabModel );