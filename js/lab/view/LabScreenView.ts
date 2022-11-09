// Copyright 2019-2022, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen. Adds no additional functionality to NaturalSelectionScreenView,
 * but included for completeness of the class hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionScreenView from '../../common/view/NaturalSelectionScreenView.js';
import naturalSelection from '../../naturalSelection.js';
import LabModel from '../model/LabModel.js';

export default class LabScreenView extends NaturalSelectionScreenView {

  public constructor( model: LabModel, tandem: Tandem ) {
    super( model, {

      // phet-io
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'LabScreenView', LabScreenView );