import { describe, it, expect } from 'vitest';
import { generateProtoFile, ProtoFile } from './';

// The existing generateProtoFile function is assumed here, as described in previous responses.

const testAST: ProtoFile = {
  syntax: "proto3",
  package: "",  // No package for this file
  imports: [
      "aelf/options.proto",
      "google/protobuf/empty.proto",
      "google/protobuf/wrappers.proto",
      "Protobuf/reference/acs12.proto"
  ],

  messages: [
      {
          name: "UpdatedMessage",
          fields: [
              { name: "value", type: "string", id: 1 }
          ],
          options: {
              "aelf.is_event": "true",
          }
      }
  ],

  services: [
      {
          name: "HelloWorld",
          options: [
              { key: "aelf.csharp_state", value: `"AElf.Contracts.HelloWorld.HelloWorldState"` },
              { key: "aelf.base", value: `"Protobuf/reference/acs12.proto"` }
          ],
          methods: [
              {
                  name: "Update",
                  inputType: "google.protobuf.StringValue",
                  outputType: "google.protobuf.Empty"
              },
              {
                  name: "Read",
                  inputType: "google.protobuf.Empty",
                  outputType: "google.protobuf.StringValue",
                  options: [
                      { key: "aelf.is_view", value: "true" }
                  ]
              }
          ]
      }
  ],

  options: {
      "csharp_namespace": `"AElf.Contracts.HelloWorld"`
  }
};

// Expected formatted output
const expectedProtoOutput = `
syntax = "proto3";

import "aelf/options.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/wrappers.proto";
import "Protobuf/reference/acs12.proto";

option csharp_namespace = "AElf.Contracts.HelloWorld";

service HelloWorld {
  option (aelf.csharp_state) = "AElf.Contracts.HelloWorld.HelloWorldState";
  option (aelf.base) = "Protobuf/reference/acs12.proto";

  rpc Update (google.protobuf.StringValue) returns (google.protobuf.Empty);
  rpc Read (google.protobuf.Empty) returns (google.protobuf.StringValue) {
    option (aelf.is_view) = true;
  }
}

message UpdatedMessage {
  option (aelf.is_event) = true;
  string value = 1;
}
`.trim();

describe('generateProtoFile', () => {
  it('should work', () => {
    expect(generateProtoFile(testAST)).toEqual(expectedProtoOutput);
  });
});
