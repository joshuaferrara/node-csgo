/*
Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io) 
and Contributors (http://phpjs.org/authors)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function pack(format) {
  //  discuss at: http://phpjs.org/functions/pack/
  // original by: Tim de Koning (http://www.kingsquare.nl)
  //    parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Tim de Koning (http://www.kingsquare.nl)
  //        note: Float encoding by: Jonas Raoni Soares Silva
  //        note: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444
  //        note: Feedback: phpjs-pack@kingsquare.nl
  //        note: 'machine dependent byte order and size' aren't
  //        note: applicable for JavaScript; pack works as on a 32bit,
  //        note: little endian machine
  //   example 1: pack('nvc*', 0x1234, 0x5678, 65, 66);
  //   returns 1: '4xVAB'

  var formatPointer = 0,
    argumentPointer = 1,
    result = '',
    argument = '',
    i = 0,
    r = [],
    instruction, quantifier, word, precisionBits, exponentBits, extraNullCount;

  // vars used by float encoding
  var bias, minExp, maxExp, minUnnormExp, status, exp, len, bin, signal, n, intPart, floatPart, lastBit, rounded, j,
    k, tmpResult;

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer);
    quantifier = '';
    formatPointer++;
    while ((formatPointer < format.length) && (format.charAt(formatPointer)
      .match(/[\d\*]/) !== null)) {
      quantifier += format.charAt(formatPointer);
      formatPointer++;
    }
    if (quantifier === '') {
      quantifier = '1';
    }

    // Now pack variables: 'quantifier' times 'instruction'
    switch (instruction) {
      case 'a':
        // NUL-padded string
      case 'A':
        // SPACE-padded string
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments');
        } else {
          argument = String(arguments[argumentPointer]);
        }
        if (quantifier === '*') {
          quantifier = argument.length;
        }
        for (i = 0; i < quantifier; i++) {
          if (typeof argument[i] === 'undefined') {
            if (instruction === 'a') {
              result += String.fromCharCode(0);
            } else {
              result += ' ';
            }
          } else {
            result += argument[i];
          }
        }
        argumentPointer++;
        break;
      case 'h':
        // Hex string, low nibble first
      case 'H':
        // Hex string, high nibble first
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments');
        } else {
          argument = arguments[argumentPointer];
        }
        if (quantifier === '*') {
          quantifier = argument.length;
        }
        if (quantifier > argument.length) {
          throw new Error('Warning: pack() Type ' + instruction + ': not enough characters in string');
        }
        for (i = 0; i < quantifier; i += 2) {
          // Always get per 2 bytes...
          word = argument[i];
          if (((i + 1) >= quantifier) || typeof argument[i + 1] === 'undefined') {
            word += '0';
          } else {
            word += argument[i + 1];
          }
          // The fastest way to reverse?
          if (instruction === 'h') {
            word = word[1] + word[0];
          }
          result += String.fromCharCode(parseInt(word, 16));
        }
        argumentPointer++;
        break;

      case 'c':
        // signed char
      case 'C':
        // unsigned char
        // c and C is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer]);
          argumentPointer++;
        }
        break;

      case 's':
        // signed short (always 16 bit, machine byte order)
      case 'S':
        // unsigned short (always 16 bit, machine byte order)
      case 'v':
        // s and S is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          argumentPointer++;
        }
        break;

      case 'n':
        // unsigned short (always 16 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          argumentPointer++;
        }
        break;

      case 'i':
        // signed integer (machine dependent size and byte order)
      case 'I':
        // unsigned integer (machine dependent size and byte order)
      case 'l':
        // signed long (always 32 bit, machine byte order)
      case 'L':
        // unsigned long (always 32 bit, machine byte order)
      case 'V':
        // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
          argumentPointer++;
        }

        break;
      case 'N':
        // unsigned long (always 32 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          argumentPointer++;
        }
        break;

      case 'f':
        // float (machine dependent size and representation)
      case 'd':
        // double (machine dependent size and representation)
        // version original by IEEE754
        precisionBits = 23;
        exponentBits = 8;
        if (instruction === 'd') {
          precisionBits = 52;
          exponentBits = 11;
        }

        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }
        for (i = 0; i < quantifier; i++) {
          argument = arguments[argumentPointer];
          bias = Math.pow(2, exponentBits - 1) - 1;
          minExp = -bias + 1;
          maxExp = bias;
          minUnnormExp = minExp - precisionBits;
          status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0;
          exp = 0;
          len = 2 * bias + 1 + precisionBits + 3;
          bin = new Array(len);
          signal = (n = status !== 0 ? 0 : n) < 0;
          n = Math.abs(n);
          intPart = Math.floor(n);
          floatPart = n - intPart;

          for (k = len; k;) {
            bin[--k] = 0;
          }
          for (k = bias + 2; intPart && k;) {
            bin[--k] = intPart % 2;
            intPart = Math.floor(intPart / 2);
          }
          for (k = bias + 1; floatPart > 0 && k; --floatPart) {
            (bin[++k] = ((floatPart *= 2) >= 1) - 0);
          }
          for (k = -1; ++k < len && !bin[k];) {}

          if (bin[(lastBit = precisionBits - 1 + (k = (exp = bias + 1 - k) >= minExp && exp <= maxExp ? k + 1 :
            bias + 1 - (exp = minExp - 1))) + 1]) {
            if (!(rounded = bin[lastBit])) {
              for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
            }
            for (j = lastBit + 1; rounded && --j >= 0;
              (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
          }

          for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

          if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
            ++k;
          } else {
            if (exp < minExp) {
              if (exp !== bias + 1 - len && exp < minUnnormExp) { /*"encodeFloat::float underflow" */ }
              k = bias + 1 - (exp = minExp - 1);
            }
          }

          if (intPart || status !== 0) {
            exp = maxExp + 1;
            k = bias + 2;
            if (status === -Infinity) {
              signal = 1;
            } else if (isNaN(status)) {
              bin[k] = 1;
            }
          }

          n = Math.abs(exp + bias);
          tmpResult = '';

          for (j = exponentBits + 1; --j;) {
            tmpResult = (n % 2) + tmpResult;
            n = n >>= 1;
          }

          n = 0;
          j = 0;
          k = (tmpResult = (signal ? '1' : '0') + tmpResult + bin.slice(k, k + precisionBits)
            .join(''))
            .length;
          r = [];

          for (; k;) {
            n += (1 << j) * tmpResult.charAt(--k);
            if (j === 7) {
              r[r.length] = String.fromCharCode(n);
              n = 0;
            }
            j = (j + 1) % 8;
          }

          r[r.length] = n ? String.fromCharCode(n) : '';
          result += r.join('');
          argumentPointer++;
        }
        break;

      case 'x':
        // NUL byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type x: \'*\' ignored');
        }
        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(0);
        }
        break;

      case 'X':
        // Back up one byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored');
        }
        for (i = 0; i < quantifier; i++) {
          if (result.length === 0) {
            throw new Error('Warning: pack(): Type X:' + ' outside of string');
          } else {
            result = result.substring(0, result.length - 1);
          }
        }
        break;

      case '@':
        // NUL-fill to absolute position
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored');
        }
        if (quantifier > result.length) {
          extraNullCount = quantifier - result.length;
          for (i = 0; i < extraNullCount; i++) {
            result += String.fromCharCode(0);
          }
        }
        if (quantifier < result.length) {
          result = result.substring(0, quantifier);
        }
        break;

      default:
        throw new Error('Warning:  pack() Type ' + instruction + ': unknown format code');
    }
  }
  if (argumentPointer < arguments.length) {
    throw new Error('Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused');
  }

  return result;
}

function unpack(format, data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tim de Koning (http://www.kingsquare.nl)
  // +      parts by: Jonas Raoni Soares Silva - http://www.jsfromhell.com
  // +      parts by: Joshua Bell - http://cautionsingularityahead.blogspot.nl/
  // +
  // +   bugfixed by: marcuswestin
  // %        note 1: Float decoding by: Jonas Raoni Soares Silva
  // %        note 2: Home: http://www.kingsquare.nl/blog/22-12-2009/13650536
  // %        note 3: Feedback: phpjs-unpack@kingsquare.nl
  // %        note 4: 'machine dependant byte order and size' aren't
  // %        note 5: applicable for JavaScript unpack works as on a 32bit,
  // %        note 6: little endian machine
  // *     example 1: unpack('d', "\u0000\u0000\u0000\u0000\u00008YÀ");
  // *     returns 1: { "": -100.875 }

  var formatPointer = 0, dataPointer = 0, result = {}, instruction = '',
      quantifier = '', label = '', currentData = '', i = 0, j = 0,
      word = '', fbits = 0, ebits = 0, dataByteLength = 0;

  // Used by float decoding - by Joshua Bell
  //http://cautionsingularityahead.blogspot.nl/2010/04/javascript-and-ieee754-redux.html
  var fromIEEE754 = function(bytes, ebits, fbits) {
    // Bytes to bits
    var bits = [];
    for (var i = bytes.length; i; i -= 1) {
      var byte = bytes[i - 1];
      for (var j = 8; j; j -= 1) {
        bits.push(byte % 2 ? 1 : 0); byte = byte >> 1;
      }
    }
    bits.reverse();
    var str = bits.join('');

    // Unpack sign, exponent, fraction
    var bias = (1 << (ebits - 1)) - 1;
    var s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    var e = parseInt(str.substring(1, 1 + ebits), 2);
    var f = parseInt(str.substring(1 + ebits), 2);

    // Produce number
    if (e === (1 << ebits) - 1) {
      return f !== 0 ? NaN : s * Infinity;
    }
    else if (e > 0) {
      return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
    }
    else if (f !== 0) {
      return s * Math.pow(2, -(bias-1)) * (f / Math.pow(2, fbits));
    }
    else {
      return s * 0;
    }
  }

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer);

    // Start reading 'quantifier'
    quantifier = '';
    formatPointer++;
    while ((formatPointer < format.length) &&
        (format.charAt(formatPointer).match(/[\d\*]/) !== null)) {
      quantifier += format.charAt(formatPointer);
      formatPointer++;
    }
    if (quantifier === '') {
      quantifier = '1';
    }


    // Start reading label
    label = '';
    while ((formatPointer < format.length) &&
        (format.charAt(formatPointer) !== '/')) {
      label += format.charAt(formatPointer);
      formatPointer++;
    }
    if (format.charAt(formatPointer) === '/') {
      formatPointer++;
    }

    // Process given instruction
    switch (instruction) {
      case 'a': // NUL-padded string
      case 'A': // SPACE-padded string
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }
        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        if (instruction === 'a') {
          currentResult = currentData.replace(/\0+$/, '');
        } else {
          currentResult = currentData.replace(/ +$/, '');
        }
        result[label] = currentResult;
        break;

      case 'h': // Hex string, low nibble first
      case 'H': // Hex string, high nibble first
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }
        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        if (quantifier > currentData.length) {
          throw new Error('Warning: unpack(): Type ' + instruction +
              ': not enough input, need ' + quantifier);
        }

        currentResult = '';
        for (i = 0; i < currentData.length; i++) {
          word = currentData.charCodeAt(i).toString(16);
          if (instruction === 'h') {
            word = word[1] + word[0];
          }
          currentResult += word;
        }
        result[label] = currentResult;
        break;

      case 'c': // signed char
      case 'C': // unsigned c
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        for (i = 0; i < currentData.length; i++) {
          currentResult = currentData.charCodeAt(i);
          if ((instruction === 'c') && (currentResult >= 128)) {
            currentResult -= 256;
          }
          result[label + (quantifier > 1 ?
              (i + 1) :
              '')] = currentResult;
        }
        break;

      case 'S': // unsigned short (always 16 bit, machine byte order)
      case 's': // signed short (always 16 bit, machine byte order)
      case 'v': // unsigned short (always 16 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 2;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 2);
        dataPointer += quantifier * 2;

        for (i = 0; i < currentData.length; i += 2) {
          // sum per word;
          currentResult = ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
              (currentData.charCodeAt(i) & 0xFF);
          if ((instruction === 's') && (currentResult >= 32768)) {
            currentResult -= 65536;
          }
          result[label + (quantifier > 1 ?
              ((i / 2) + 1) :
              '')] = currentResult;
        }
        break;

      case 'n': // unsigned short (always 16 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 2;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 2);
        dataPointer += quantifier * 2;

        for (i = 0; i < currentData.length; i += 2) {
          // sum per word;
          currentResult = ((currentData.charCodeAt(i) & 0xFF) << 8) +
              (currentData.charCodeAt(i + 1) & 0xFF);
          result[label + (quantifier > 1 ?
              ((i / 2) + 1) :
              '')] = currentResult;
        }
        break;

      case 'i': // signed integer (machine dependent size and byte order)
      case 'I': // unsigned integer (machine dependent size & byte order)
      case 'l': // signed long (always 32 bit, machine byte order)
      case 'L': // unsigned long (always 32 bit, machine byte order)
      case 'V': // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 4;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 4);
        dataPointer += quantifier * 4;

        for (i = 0; i < currentData.length; i += 4) {
          currentResult =
              ((currentData.charCodeAt(i + 3) & 0xFF) << 24) +
              ((currentData.charCodeAt(i + 2) & 0xFF) << 16) +
              ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
              ((currentData.charCodeAt(i) & 0xFF));
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = currentResult;
        }

        break;

      case 'N': // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 4;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 4);
        dataPointer += quantifier * 4;

        for (i = 0; i < currentData.length; i += 4) {
          currentResult =
              ((currentData.charCodeAt(i) & 0xFF) << 24) +
              ((currentData.charCodeAt(i + 1) & 0xFF) << 16) +
              ((currentData.charCodeAt(i + 2) & 0xFF) << 8) +
              ((currentData.charCodeAt(i + 3) & 0xFF));
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = currentResult;
        }

        break;

      case 'f': //float
      case 'd': //double
        ebits = 8;
        fbits = (instruction === 'f') ? 23 : 52;
        dataByteLength = 4;
        if (instruction === 'd') {
          ebits = 11;
          dataByteLength = 8;
        }

        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / dataByteLength;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * dataByteLength);
        dataPointer += quantifier * dataByteLength;

        for (i = 0; i < currentData.length; i += dataByteLength) {
          data = currentData.substr(i, dataByteLength);

          bytes = [];
          for (j = data.length - 1; j >= 0; --j) {
            bytes.push(data.charCodeAt(j));
          }
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = fromIEEE754(bytes, ebits, fbits);
        }

        break;

      case 'x': // NUL byte
      case 'X': // Back up one byte
      case '@': // NUL byte
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        if (quantifier > 0) {
          if (instruction === 'X') {
            dataPointer -= quantifier;
          } else {
            if (instruction === 'x') {
              dataPointer += quantifier;
            } else {
              dataPointer = quantifier;
            }
          }
        }
        break;

      default:
        throw new Error('Warning:  unpack() Type ' + instruction +
            ': unknown format code');
    }
  }
  return result;
}

exports.pack = pack;
exports.unpack = unpack;