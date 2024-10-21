/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as Carmentis from "./carmentis-nodejs-sdk.js";

const fileSystem  = Carmentis.core.storage.fileSystem;
const textEncoder = Carmentis.core.util.textEncoder;

let dir = fileSystem.directory("WALLET"),
    uid,
    encryptionKey;

// ============================================================================================================================ //
//  setUser()                                                                                                                   //
// ============================================================================================================================ //
export function setUser(userId) {
  uid = "walletFile" + userId;
}

// ============================================================================================================================ //
//  setKey()                                                                                                                    //
// ============================================================================================================================ //
export function setKey(key) {
  encryptionKey = key;
}

// ============================================================================================================================ //
//  getBits()                                                                                                                   //
// ============================================================================================================================ //
export function getBits() {
  return encryptionKey.getBits();
}

// ============================================================================================================================ //
//  exists()                                                                                                                    //
// ============================================================================================================================ //
export async function exists(file) {
  return await dir.byUid(uid, file).exists();
}

// ============================================================================================================================ //
//  readJson()                                                                                                                  //
// ============================================================================================================================ //
export async function readJson(file) {
  let data = await read(file),
      content;

  try {
    content = JSON.parse(textEncoder.decode(data));
  }
  catch(e) {
    content = null;
  }

  return content;
}

// ============================================================================================================================ //
//  read()                                                                                                                      //
// ============================================================================================================================ //
export async function read(file) {
  let encryptedData = await dir.byUid(uid, file).read();

  return await encryptionKey.decrypt(encryptedData);
}

// ============================================================================================================================ //
//  writeJson()                                                                                                                 //
// ============================================================================================================================ //
export async function writeJson(file, data) {
  let encodedData = textEncoder.encode(JSON.stringify(data));

  return await write(file, encodedData);
}

// ============================================================================================================================ //
//  write()                                                                                                                     //
// ============================================================================================================================ //
export async function write(file, data) {
  let encryptedData = await encryptionKey.encrypt(data);

  return await dir.byUid(uid, file).write(encryptedData);
}

// ============================================================================================================================ //
//  del()                                                                                                                       //
// ============================================================================================================================ //
export async function del(file) {
  return await dir.byUid(uid, file).del();
}
