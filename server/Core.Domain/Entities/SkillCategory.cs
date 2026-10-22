using System.Collections.Generic;
using Core.Domain.Common;

namespace Core.Domain.Entities;

public class SkillCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string RuneSymbol { get; set; } = string.Empty;

    // Navigation property
    public virtual ICollection<SkillItem> Skills { get; set; } = new List<SkillItem>();
}