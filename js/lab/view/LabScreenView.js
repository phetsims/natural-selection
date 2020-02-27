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
import LabViewProperties from './LabViewProperties.js';

class LabScreenView extends NaturalSelectionScreenView {

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    assert && assert( model instanceof LabModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const viewProperties = new LabViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties, {

      // phet-io
      tandem: tandem
    } );

    //TODO

    // @private
    this.viewProperties = viewProperties;
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.viewProperties.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'LabScreenView does not support dispose' );
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   * @override
   */
  step( dt ) {
    super.step( dt );
    //TODO
  }
}

naturalSelection.register( 'LabScreenView', LabScreenView );
export default LabScreenView;