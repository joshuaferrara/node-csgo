/*
Copyright (c) 2012 Jacob Rus

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the 
"Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

File-like objects that read from or write to a string buffer.
A nearly direct port of Python’s StringIO module.
f = StringIO()       # ready for writing
f = StringIO(buf)    # ready for reading
f.close()            # explicitly release resources held
pos = f.tell()       # get current position
f.seek(pos)          # set current position
f.seek(pos, mode)    # mode 0: absolute; 1: relative; 2: relative to EOF
buf = f.read()       # read until EOF
buf = f.read(n)      # read up to n bytes
buf = f.readline()   # read until end of line ('\n') or EOF
list = f.readlines() # list of f.readline() results until EOF
f.truncate([size])   # truncate file to at most size (default: current pos)
f.write(buf)         # write at current position
f.writelines(list)   # for line in list: f.write(line)
f.getvalue()         # return whole file's contents as a string
Notes:
- Seeking far beyond EOF and then writing will insert real null
  bytes that occupy space in the buffer.
- There's a simple test set (see end of this file).
 */
var StringIO, _complain_ifclosed, _test, module_root;

_complain_ifclosed = function(closed) {
  if (closed) {
    throw new Error('I/O operation on closed file');
  }
};


/* class StringIO([buffer])
When a StringIO object is created, it can be initialized to an existing
string by passing the string to the constructor. If no string is given,
the StringIO will start empty.
 */

StringIO = (function() {
  function StringIO(buf) {
    if (buf == null) {
      buf = '';
    }
    this.buf = '' + buf;
    this.length = this.buf.length;
    this.buflist = [];
    this.pos = 0;
    this.closed = false;
  }


  /* Free the memory buffer. */

  StringIO.prototype.close = function() {
    if (!this.closed) {
      this.closed = true;
      delete this.buf;
      delete this.pos;
    }
  };

  StringIO.prototype._flush_buflist = function() {
    this.buf += this.buflist.join('');
    return this.buflist = [];
  };


  /* Set the file's current position.
  The mode argument is optional and defaults to 0 (absolute file
  positioning); other values are 1 (seek relative to the current
  position) and 2 (seek relative to the file's end).
  There is no return value.
   */

  StringIO.prototype.seek = function(pos, mode) {
    if (mode == null) {
      mode = 0;
    }
    _complain_ifclosed(this.closed);
    if (this.buflist.length) {
      this._flush_buflist();
    }
    if (mode === 1) {
      pos += this.pos;
    } else if (mode === 2) {
      pos += this.length;
    }
    this.pos = Math.max(0, pos);
  };


  /* Return the file's current position. */

  StringIO.prototype.tell = function() {
    _complain_ifclosed(this.closed);
    return this.pos;
  };


  /* Read at most size bytes from the file
  (less if the read hits EOF before obtaining size bytes).
  If the size argument is negative or omitted, read all data until EOF
  is reached. The bytes are returned as a string object. An empty
  string is returned when EOF is encountered immediately.
   */

  StringIO.prototype.read = function(n) {
    var newpos, r;
    if (n == null) {
      n = -1;
    }
    _complain_ifclosed(this.closed);
    if (this.buflist.length) {
      this._flush_buflist();
    }
    if (n < 0) {
      newpos = this.length;
    } else {
      newpos = Math.min(this.pos + n, this.length);
    }
    r = this.buf.slice(this.pos, newpos);
    this.pos = newpos;
    return r;
  };


  /* Read one entire line from the file.
  
  A trailing newline character is kept in the string (but may be absent
  when a file ends with an incomplete line). If the size argument is
  present and non-negative, it is a maximum byte count (including the
  trailing newline) and an incomplete line may be returned.
  An empty string is returned only when EOF is encountered immediately.
   */

  StringIO.prototype.readline = function(length) {
    var i, newpos, r;
    if (length == null) {
      length = null;
    }
    _complain_ifclosed(this.closed);
    if (this.buflist.length) {
      this._flush_buflist();
    }
    i = this.buf.indexOf('\n', this.pos);
    if (i < 0) {
      newpos = this.length;
    } else {
      newpos = i + 1;
    }
    if ((length != null) && this.pos + length < newpos) {
      newpos = this.pos + length;
    }
    r = this.buf.slice(this.pos, newpos);
    this.pos = newpos;
    return r;
  };


  /* Read until EOF using readline() and return a list containing the
  lines thus read.
  If the optional sizehint argument is present, instead of reading up
  to EOF, whole lines totalling approximately sizehint bytes (or more
  to accommodate a final whole line).
   */

  StringIO.prototype.readlines = function(sizehint) {
    var line, lines, total;
    if (sizehint == null) {
      sizehint = 0;
    }
    total = 0;
    lines = [];
    line = this.readline();
    while (line) {
      lines.push(line);
      total += line.length;
      if ((0 < sizehint && sizehint <= total)) {
        break;
      }
      line = this.readline();
    }
    return lines;
  };


  /* Truncate the file's size.
  If the optional size argument is present, the file is truncated to
  (at most) that size. The size defaults to the current position.
  The current file position is not changed unless the position
  is beyond the new file size.
  If the specified size exceeds the file's current size, the
  file remains unchanged.
   */

  StringIO.prototype.truncate = function(size) {
    if (size == null) {
      size = null;
    }
    _complain_ifclosed(this.closed);
    if (size == null) {
      size = this.pos;
    } else if (size < 0) {
      throw new Error('Negative size not allowed');
    } else if (size < this.pos) {
      this.pos = size;
    }
    this.buf = this.getvalue().slice(0, size);
    this.length = size;
  };


  /* Write a string to the file.
  There is no return value.
   */

  StringIO.prototype.write = function(s) {
    var newpos, null_bytes, slen, spos;
    _complain_ifclosed(this.closed);
    if (!s) {
      return;
    }
    if (typeof s !== 'string') {
      s = s.toString();
    }
    spos = this.pos;
    slen = this.length;
    if (spos === slen) {
      this.buflist.push(s);
      this.length = this.pos = spos + s.length;
      return;
    }
    if (spos > slen) {
      null_bytes = (Array(spos - slen + 1)).join('\x00');
      this.buflist.push(null_bytes);
      slen = spos;
    }
    newpos = spos + s.length;
    if (spos < slen) {
      if (this.buflist.length) {
        this._flush_buflist();
      }
      this.buflist.push(this.buf.slice(0, spos), s, this.buf.slice(newpos));
      this.buf = '';
      if (newpos > slen) {
        slen = newpos;
      }
    } else {
      this.buflist.push(s);
      slen = newpos;
    }
    this.length = slen;
    this.pos = newpos;
  };


  /* Write a sequence of strings to the file. The sequence can be any
  iterable object producing strings, typically a list of strings. There
  is no return value.
  (The name is intended to match readlines(); writelines() does not add
  line separators.)
   */

  StringIO.prototype.writelines = function(array) {
    var j, len, line;
    for (j = 0, len = array.length; j < len; j++) {
      line = array[j];
      this.write(line);
    }
  };


  /* Flush the internal buffer */

  StringIO.prototype.flush = function() {
    _complain_ifclosed(this.closed);
  };


  /* Retrieve the entire contents of the "file" at any time
  before the StringIO object's close() method is called.
   */

  StringIO.prototype.getvalue = function() {
    if (this.buflist.length) {
      this._flush_buflist();
    }
    return this.buf;
  };

  return StringIO;

})();

module_root = typeof exports !== "undefined" && exports !== null ? exports : typeof window !== "undefined" && window !== null ? window : this;

module_root.StringIO = StringIO;

_test = function() {
  var f, j, len, length, line, line2, lines, list, print, ref;
  print = function() {
    return console.log.apply(console, arguments);
  };
  lines = ['This is a test,\n', 'Blah blah blah,\n', 'Wow does this work?\n', 'Okay, here are some lines\n', 'of text.\n'];
  f = new StringIO;
  ref = lines.slice(0, -2);
  for (j = 0, len = ref.length; j < len; j++) {
    line = ref[j];
    f.write(line);
  }
  f.writelines(lines.slice(-2));
  if (f.getvalue() !== lines.join('')) {
    throw new Error('write failed');
  }
  length = f.tell();
  print('File length =', length);
  f.seek(lines[0].length);
  f.write(lines[1]);
  f.seek(0);
  print("First line = " + (f.readline()));
  print("Position = " + (f.tell()));
  line = f.readline();
  print("Second line = " + line);
  f.seek(-line.length, 1);
  line2 = f.read(line.length);
  if (line !== line2) {
    throw new Error('bad result after seek back');
  }
  f.seek(-line2.length, 1);
  list = f.readlines();
  line = list[list.length - 1];
  f.seek(f.tell() - line.length);
  line2 = f.read();
  if (line !== line2) {
    throw new Error('bad result after seek back from EOF');
  }
  print("Read " + list.length + " more lines");
  print("File length = " + (f.tell()));
  if (f.tell() !== length) {
    throw new Error('bad length');
  }
  f.truncate((length / 2) | 0);
  f.seek(0, 2);
  print("Truncated length = " + (f.tell()));
  if (f.tell() !== ((length / 2) | 0)) {
    throw new Error('truncate did not adjust length');
  }
  return f.close();
};