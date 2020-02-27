// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabViewProperties contains view-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionViewProperties from '../../common/view/NaturalSelectionViewProperties.js';
import naturalSelection from '../../naturalSelection.js';

class LabViewProperties extends NaturalSelectionViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );
    //TODO
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    //TODO
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'LabViewProperties does not support dispose' );
  }
}

naturalSelection.register( 'LabViewProperties', LabViewProperties );
export default LabViewProperties;