// Represents the entire Protobuf file
export interface ProtoFile {
  package?: string;
  imports?: string[];
  syntax: string;
  messages: ProtoMessage[];
  enums?: ProtoEnum[];
  services?: ProtoService[];
  options?: Record<string, string>;
}

// Represents a Protobuf message
interface ProtoMessage {
  name: string;
  fields: ProtoField[];
  options?: Record<string, string>;
}

// Represents fields inside a Protobuf message
interface ProtoField {
  name: string;
  type: string;
  id: number;
  repeated?: boolean;
  optional?: boolean;
}

// Represents a Protobuf enum
interface ProtoEnum {
  name: string;
  values: { [key: string]: number };
}

// New interface to represent Protobuf option key-value pairs
interface ProtoOption {
  key: string; // Option key (e.g., "google.api.http")
  value: string; // Option value (this could be a structured value or number/string)
}

// Represents a Protobuf service
interface ProtoService {
  name: string;
  methods: ProtoMethod[];
  options?: ProtoOption[];
}

// Represents a method in a service
interface ProtoMethod {
  name: string;
  inputType: string;
  outputType: string;
  options?: ProtoOption[]; // Add method-level option
}

export function generateProtoFile(ast: ProtoFile): string {
  let output = '';

  // Add syntax
  output += `syntax = "${ast.syntax}";\n\n`;

  // Add imports
  if (ast.imports && ast.imports.length > 0) {
    ast.imports.forEach((imp) => {
      output += `import "${imp}";\n`;
    });
    output += '\n'; // Blank line after imports
  }

  // Add file-level options if any
  if (ast.options) {
    for (const [optionName, optionValue] of Object.entries(ast.options)) {
      output += `option ${optionName} = ${optionValue};\n`;
    }
    output += '\n'; // Blank line after file-level options
  }

  // Add enums if any (Not in this case, but handled for the sake of completeness)
  if (ast.enums) {
    for (const protoEnum of ast.enums) {
      output += `enum ${protoEnum.name} {\n`;
      for (const [key, value] of Object.entries(protoEnum.values)) {
        output += `  ${key} = ${value};\n`;
      }
      output += '}\n\n'; // Blank line after each enum
    }
  }

  // Add services
  if (ast.services && ast.services.length > 0) {
    for (const service of ast.services) {
      output += `service ${service.name} {\n`;

      // Add service-level options
      if (service.options) {
        for (const option of service.options) {
          output += `  option (${option.key}) = ${option.value};\n`; // Indented
        }
      }

      output += '\n'; // Add an extra blank line before methods

      // Add methods
      for (const method of service.methods) {
        output += `  rpc ${method.name} (${method.inputType}) returns (${method.outputType})`;

        // If method has options, add them in a block
        if (method.options && method.options.length > 0) {
          output += ' {\n';
          for (const option of method.options) {
            output += `    option (${option.key}) = ${option.value};\n`; // Nested indentation for options
          }
          output += '  }\n';
        } else {
          output += ';\n'; // End of method without options
        }
      }

      output += '}\n\n'; // Blank line after each service
    }
  }

  // Add messages
  if (ast.messages && ast.messages.length > 0) {
    for (const message of ast.messages) {
      output += `message ${message.name} {\n`;

      // Add message-level options, if any
      if (message.options) {
        for (const [optionKey, optionValue] of Object.entries(
          message.options
        )) {
          output += `  option (${optionKey}) = ${optionValue};\n`;
        }
      }

      // Add fields
      for (const field of message.fields) {
        output += `  ${field.type} ${field.name} = ${field.id};\n`;
      }

      output += '}\n\n'; // Blank line after each message
    }
  }

  return output.trim();
}
