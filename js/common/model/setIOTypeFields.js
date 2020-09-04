// Copyright 2020, University of Colorado Boulder

/**
 * setIOTypeFields handles the boilerplate of filling in static fields for an IO Type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';

// constants
const IO_TYPE_SUFFIX = 'IO';

function setIOTypeFields( IOType, ioTypeName, coreType ) {

  // Fill in static fields in the IO Type.
  IOType.typeName = ioTypeName;
  IOType.documentation = `IO Type for ${ioTypeName.substring( 0, ioTypeName.length - IO_TYPE_SUFFIX.length )}`;
  IOType.validator = { valueType: coreType };

  // Verify that we've defined a valid IO Type.
  ObjectIO.validateSubtype( IOType );
}

naturalSelection.register( 'setIOTypeFields', setIOTypeFields );
export default setIOTypeFields;