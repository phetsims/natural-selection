// Copyright 2020, University of Colorado Boulder

/**
 * createIOType is a convenience function that handles the boilerplate of creating an IO Type.
 *
 * As of this writing, ObjectIO.createIOType had many problems and didn't meet the needs of this sim.
 * If that changes in the future, consider replacing this with ObjectIO.createIOType.
 * See https://github.com/phetsims/tandem/issues/188
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import merge from '../../../../phet-core/js/merge.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import naturalSelection from '../../naturalSelection.js';

// constants
const IO_TYPE_SUFFIX = 'IO';

/**
 * @param {function} coreType
 * @param {string} ioTypeName
 * @param options
 * @returns {IOType}
 */
function createIOType( coreType, ioTypeName, options ) {

  assert && assert( ioTypeName.endsWith( IO_TYPE_SUFFIX ), `IO Type name must end with ${IO_TYPE_SUFFIX}` );

  options = merge( {

    // {function} the parent IO Type
    parentIOType: ObjectIO,

    // {function|null} Serialization functions to override. null means to use parentIOType's implementation.
    // See ObjectIO for function documentation. There are 3 different types of serialization, used in different
    // situations. The functions that you'll need to override depend on which type of serialization you need.
    // See the Serialization section of the PhET-iO Instrumentation Guide at:
    // https://github.com/phetsims/phet-io/blob/3865e3e116822ecd46a18646e999213ed77caf59/doc/phet-io-instrumentation-guide.md
    toStateObject: null,
    fromStateObject: null,
    stateToArgsForConstructor: null,
    applyState: null,

    // {string} see ObjectIO.documentation. The default is (e.g.) 'IO Type for Bunny'
    documentation: `IO Type for ${ioTypeName.substring( 0, ioTypeName.length - IO_TYPE_SUFFIX.length )}`,

    // see ObjectIO.methods
    methods: {},

    // see ObjectIO.events
    events: [],

    // see ObjectIO.parameterTypes
    parameterTypes: []

  }, options );

  class IOType extends options.parentIOType {

    /**
     * See ObjectIO.toStateObject
     * @param {*} object
     * @returns {*}
     * @public
     * @override
     */
    static toStateObject( object ) {
      validate( object, this.validator );
      if ( options.toStateObject ) {
        return options.toStateObject( object );
      }
      else {
        return super.toStateObject( object );
      }
    }

    /**
     * See ObjectIO.fromStateObject
     * @param {*} stateObject
     * @returns {*}
     * @public
     * @override
     */
    static fromStateObject( stateObject ) {
      if ( options.fromStateObject ) {
        return options.fromStateObject( stateObject );
      }
      else {
        return super.fromStateObject( stateObject );
      }
    }

    /**
     * See ObjectIO.stateToArgsForConstructor
     * @param {*} state
     * @returns {*[]}
     * @public
     * @override
     */
    static stateToArgsForConstructor( state ) {
      if ( options.stateToArgsForConstructor ) {
        return options.stateToArgsForConstructor( state );
      }
      else {
        return super.stateToArgsForConstructor( state );
      }
    }

    /**
     * See ObjectIO.applyState
     * @param {*} object
     * @param {*} state
     * @returns {*}
     * @public
     * @override
     */
    static applyState( object, state ) {
      validate( object, this.validator );
      if ( options.applyState ) {
        return options.applyState( object, state );
      }
      else {
        return super.applyState( object, state );
      }
    }
  }

  IOType.documentation = options.documentation;
  IOType.validator = { valueType: coreType };
  IOType.typeName = ioTypeName;
  IOType.events = options.events;
  IOType.parameterTypes = options.parameterTypes;
  IOType.methods = options.methods;
  ObjectIO.validateSubtype( IOType );

  return IOType;
}

naturalSelection.register( 'createIOType', createIOType );
export default createIOType;