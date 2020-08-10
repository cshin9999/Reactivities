using Domain;
using Microsoft.EntityFrameworkCore;
using System;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { 
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
    

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>().HasData(
                new Value { Id = 1, Name = "Value101" },
                new Value { Id = 2, Name = "Value102" },
                new Value { Id = 3, Name = "Value103" }
            );
        }
    }

}
