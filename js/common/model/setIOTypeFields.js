// Copyright 2020, University of Colorado Boulder

/**
 * setIOTypeFields handles the boilerplate of filling in static fields for an IO Type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';

// constants
const IO_TYPE_SUFFIX = 'IO';

/**
 * @param {function} ioType - an IO Type
 * @param ioTypeName - classname of IOType
 * @param coreType - the corresponding Core Type
 * @param {Object} [options]
 */
function setIOTypeFields( ioType, ioTypeName, coreType, options ) {

  options = merge( {
    documentation: null // {string} if not provided, default is defined below
  }, options );

  // Fill in static fields in the IO Type.
  ioType.typeName = ioTypeName;
  ioType.documentation = options.documentation || `IO Type for ${ioTypeName.substring( 0, ioTypeName.length - IO_TYPE_SUFFIX.length )}`;
  ioType.validator = { valueType: coreType };

  // Verify that we've defined a valid IO Type.
  ObjectIO.validateSubtype( ioType );
}

naturalSelection.register( 'setIOTypeFields', setIOTypeFields );
export default setIOTypeFields;