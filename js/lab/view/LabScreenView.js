// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabView is the view for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionScreenView from '../../common/view/NaturalSelectionScreenView.js';
import naturalSelection from '../../naturalSelection.js';
import LabModel from '../model/LabModel.js';

class LabScreenView extends NaturalSelectionScreenView {

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    assert && assert( model instanceof LabModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, {

      // phet-io
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'LabScreenView', LabScreenView );
export default LabScreenView;