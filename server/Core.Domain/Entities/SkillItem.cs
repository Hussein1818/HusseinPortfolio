using System;
using Core.Domain.Common;

namespace Core.Domain.Entities;

public class SkillItem : BaseEntity
{
    public Guid SkillCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;

    // Navigation property
    public virtual SkillCategory? SkillCategory { get; set; }
}