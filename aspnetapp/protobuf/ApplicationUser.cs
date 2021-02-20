// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: protobuf/application_user/application_user.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace Zukte.Message.ApplicationUser {

  /// <summary>Holder for reflection information generated from protobuf/application_user/application_user.proto</summary>
  public static partial class ApplicationUserReflection {

    #region Descriptor
    /// <summary>File descriptor for protobuf/application_user/application_user.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static ApplicationUserReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "CjBwcm90b2J1Zi9hcHBsaWNhdGlvbl91c2VyL2FwcGxpY2F0aW9uX3VzZXIu",
            "cHJvdG8SHVp1a3RlLk1lc3NhZ2UuQXBwbGljYXRpb25Vc2VyIjwKD0FwcGxp",
            "Y2F0aW9uVXNlchIKCgJpZBgBIAEoCRIMCgRuYW1lGAIgASgJEg8KB3BpY3R1",
            "cmUYAyABKAliBnByb3RvMw=="));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { },
          new pbr::GeneratedClrTypeInfo(null, null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::Zukte.Message.ApplicationUser.ApplicationUser), global::Zukte.Message.ApplicationUser.ApplicationUser.Parser, new[]{ "Id", "Name", "Picture" }, null, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  /// <summary>
  /// represents a user account in the identity system 
  /// </summary>
  public sealed partial class ApplicationUser : pb::IMessage<ApplicationUser>
  #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      , pb::IBufferMessage
  #endif
  {
    private static readonly pb::MessageParser<ApplicationUser> _parser = new pb::MessageParser<ApplicationUser>(() => new ApplicationUser());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<ApplicationUser> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::Zukte.Message.ApplicationUser.ApplicationUserReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ApplicationUser() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ApplicationUser(ApplicationUser other) : this() {
      id_ = other.id_;
      name_ = other.name_;
      picture_ = other.picture_;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public ApplicationUser Clone() {
      return new ApplicationUser(this);
    }

    /// <summary>Field number for the "id" field.</summary>
    public const int IdFieldNumber = 1;
    private string id_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Id {
      get { return id_; }
      set {
        id_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "name" field.</summary>
    public const int NameFieldNumber = 2;
    private string name_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Name {
      get { return name_; }
      set {
        name_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    /// <summary>Field number for the "picture" field.</summary>
    public const int PictureFieldNumber = 3;
    private string picture_ = "";
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public string Picture {
      get { return picture_; }
      set {
        picture_ = pb::ProtoPreconditions.CheckNotNull(value, "value");
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as ApplicationUser);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(ApplicationUser other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (Id != other.Id) return false;
      if (Name != other.Name) return false;
      if (Picture != other.Picture) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (Id.Length != 0) hash ^= Id.GetHashCode();
      if (Name.Length != 0) hash ^= Name.GetHashCode();
      if (Picture.Length != 0) hash ^= Picture.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      output.WriteRawMessage(this);
    #else
      if (Id.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Id);
      }
      if (Name.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(Name);
      }
      if (Picture.Length != 0) {
        output.WriteRawTag(26);
        output.WriteString(Picture);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalWriteTo(ref pb::WriteContext output) {
      if (Id.Length != 0) {
        output.WriteRawTag(10);
        output.WriteString(Id);
      }
      if (Name.Length != 0) {
        output.WriteRawTag(18);
        output.WriteString(Name);
      }
      if (Picture.Length != 0) {
        output.WriteRawTag(26);
        output.WriteString(Picture);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(ref output);
      }
    }
    #endif

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (Id.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Id);
      }
      if (Name.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Name);
      }
      if (Picture.Length != 0) {
        size += 1 + pb::CodedOutputStream.ComputeStringSize(Picture);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(ApplicationUser other) {
      if (other == null) {
        return;
      }
      if (other.Id.Length != 0) {
        Id = other.Id;
      }
      if (other.Name.Length != 0) {
        Name = other.Name;
      }
      if (other.Picture.Length != 0) {
        Picture = other.Picture;
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
      input.ReadRawMessage(this);
    #else
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 10: {
            Id = input.ReadString();
            break;
          }
          case 18: {
            Name = input.ReadString();
            break;
          }
          case 26: {
            Picture = input.ReadString();
            break;
          }
        }
      }
    #endif
    }

    #if !GOOGLE_PROTOBUF_REFSTRUCT_COMPATIBILITY_MODE
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    void pb::IBufferMessage.InternalMergeFrom(ref pb::ParseContext input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, ref input);
            break;
          case 10: {
            Id = input.ReadString();
            break;
          }
          case 18: {
            Name = input.ReadString();
            break;
          }
          case 26: {
            Picture = input.ReadString();
            break;
          }
        }
      }
    }
    #endif

  }

  #endregion

}

#endregion Designer generated code
